var express = require('express');
var router = express.Router();
var connection = require('../config/db-config').connection;
var path = require('path');
var fs = require('fs');

router.get('/invitedgroups/:id', (req, res) => {
    var userID = req.params.id;
    console.log("here");
    var sql = `SELECT master_group.groupid,master_group.name as groupName,master_group.image,u2.name as invitedBy FROM members inner join master_group ON members.ref_groupid = master_group.groupid inner join users ON members.ref_userid = users.userid inner join users u2 ON members.invitedby = u2.userid where members.ref_userid = ${userID} and status =1 and members.ref_userid != invitedby order by master_group.timestamp DESC`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            console.log(JSON.stringify(results));
            res.status(200).send(JSON.stringify(results));

        }
    });
});
router.get('/groupbyid/:id', (req, res) => {
    var id = req.params.id;

    var sql = `select * from master_group where groupID="${id}"`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.end("Error:", err);
        } else {
            var data = {}
            console.log(results[0])
            Object.keys(results[0]).forEach((key) => {
                if (key != "password") {
                    data[key] = results[0][key]
                }
            })
            res.status(200).send(JSON.stringify(data));
        }

    });
});
router.get('/acceptedgroups/:id', (req, res) => {
    var id = req.params.id;

    var sql = `SELECT m.ref_groupid,g.name as groupName,g.image,u.name as invitedBy FROM splitwise.members as m inner join master_group as g on m.ref_groupid = g.groupid inner join users as u ON m.invitedby = u.userid where m.status = 2 and m.ref_userID = ${id}`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.end("Error:", err);
        } else {
            res.status(200).send(JSON.stringify(results));
        }

    });
});
router.put('/invite/', (req, res) => {

    console.log(req.body);
    var userID = Number(req.body.userID);
    var groupID = req.body.groupID;
    var type = req.body.type;
    var sql = null;
    if (type == "accept") {
        sql = `update members set status=2 where ref_userID=${userID} and ref_groupID = ${groupID}`;
    }
    else {
        sql = `update members set status=0 where ref_userID=${userID} and ref_groupID = ${groupID}`;

    }
    var values = [userID, groupID]

    connection.query(sql, values, (err, results) => {
        if (err) {
            res.end("Error:", err);
        }
        else {
            res.status(200).send(JSON.stringify(results));

        }
    });
});
router.put('/updategroup/', (req, res) => {

    console.log(req.body);
    var groupID = req.body.groupID;
    var groupName = req.body.groupName;
    var values = [req.body.groupName, groupID];

    var sql = `update master_group set name = '${groupName}' where groupid = ${groupID}`;
    connection.query(sql, values, (err, results) => {
        if (err) {
            if (err.sqlMessage.includes("Duplicate entry")) {
                res.status(400).send(' Duplicate Group Name')
            }
            res.status(400).end("Error in updating, Please contact database administrator.");
        }
        else {
            console.log("Here");
             res.status(200).send(JSON.stringify(results));

        }
    });
    // var userID = Number(req.body.userID);
    // var groupID = req.body.groupID;
    // var type = req.body.type;
    // var sql = null;
    // if (type == "accept") {
    //     sql = `update members set status=2 where ref_userID=${userID} and ref_groupID = ${groupID}`;
    // }
    // else {
    //     sql = `update members set status=0 where ref_userID=${userID} and ref_groupID = ${groupID}`;

    // }
    // var values = [userID, groupID]

    // connection.query(sql, values, (err, results) => {
    //     if (err) {
    //         res.end("Error:", err);
    //     }
    //     else {
    //         res.status(200).send(JSON.stringify(results));

    //     }
    // });
});
router.post('/uploadprofileimage', (req, res) => {
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    const file = req.files.profileImage;
    //Get the groupID,file name from frontend
    var groupID = req.files.profileImage.name.split(',')[1];
    const fileName = req.files.profileImage.name.split(',')[0];
    var pathToImage = path.join(__dirname, '../public');
    const filePathwithoutfileName = pathToImage + '/images/grouppics/' + groupID;
    const filePath = pathToImage + '/images/grouppics/' + groupID + '/' + fileName;
    //Create a file with that path
    if (!fs.existsSync(filePathwithoutfileName)) {
        fs.mkdirSync(filePathwithoutfileName);
    }
    //Move the image to that path
    console.log(groupID);
    console.log(fileName);
    console.log(pathToImage);
    file.mv(filePath, err => {
        if (err) {
            return res.status(500).end(err);
        }
        else {
            //Update the image path in the database
            var sql = `update master_group set image='${fileName}' where groupID=${groupID}`;
            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(400).end("Error:", err);
                }
            });
        }
    })
    //Send the file name and file path to the client
    res.json({
        fileName: fileName,
        filePath: filePath
    })
});
router.post('/new', (req, res) => {
    //var timestamp = Date.now().toLocaleString()
    let dateObject = new Date(new Date());
    let date = dateObject.getDate().toString();
    let month = (dateObject.getMonth() + 1).toString();
    let year = dateObject.getFullYear().toString();
    let time = dateObject.getHours().toString() + "-" + dateObject.getMinutes().toString() + "-" + dateObject.getSeconds().toString();
    let timestamp = year + "-" + month + "-" + date + "-" + time;
    var sql = `insert into master_group(name,timestamp) values(?,?);`
    var values = [req.body.groupName, timestamp];
    connection.query(sql, values, (err, results, fields) => {
        if (err) {
            if (err.sqlMessage.includes("Duplicate entry")) {
                res.status(400).send(' Duplicate Group Name')
            }
            console.log("In this error ");
            console.log(err);

        }
        else {
            console.log(results.insertId);
            console.log(req.body.selectedUsers.length);
            for (var i = 0; i < req.body.selectedUsers.length; i++) {
                var ref_userID = req.body.selectedUsers[i].value;
                var ref_groupID = results.insertId;
                var status = 1;
                var invitedBy = Number(req.body.userID);
                var sql = `insert into members(ref_userID,ref_groupID,status,invitedBy) values(?,?,?,?);`
                var values = [ref_userID, ref_groupID, status, invitedBy];
                connection.query(sql, values, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                        res.status(400).send("Error");
                    }
                })

            }
            var sql = `insert into members(ref_userID,ref_groupID,status,invitedBy) values(?,?,?,?);`
            var values = [req.body.userID, results.insertId, status, req.body.userID];
            //TODO: The id of the person appears twice, change that 

            connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).send("Error");
                }
            })
            var groupDetails = {
                groupID: results.insertId
            }
            res.status(200).send(groupDetails);
        }
    });
})





module.exports = router;