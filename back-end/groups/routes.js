var express = require('express');
var router = express.Router();
var connection = require('../config/db-config').connection;
var path = require('path');
var fs = require('fs');
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
    console.log(req.body);
    console.log(req.body.groupName);
    var sql = `insert into master_group(name) values(?);`
    var values = [req.body.groupName];
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
            var groupDetails = {
                groupID: results.insertId
            }
            res.status(200).send(groupDetails);

            // var sql = `select userID,name,email,password from users where email="${email}"`;

        }
    });
})





module.exports = router;