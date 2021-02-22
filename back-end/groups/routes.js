var express = require('express');
var router = express.Router();
var connection = require('../config/db-config').connection;



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
            console.log("Hi");
            for(var i=0 ;i <req.body.selectedUsers.length;i++)
            { 
                var ref_userID = req.body.selectedUsers[i].value;
                var ref_groupID = results.insertId;
                var status = 1;
                var invitedBy = Number(req.body.userID);
                var sql = `insert into members(ref_userID,ref_groupID,status,invitedBy) values(?,?,?,?);`
                var values = [ref_userID,ref_groupID,status,invitedBy];
                connection.query(sql, values, (err, results, fields) => {
                    if(err){
                        console.log(err);
                        res.status(400).send("Error");
                    }
                })

            }
            res.end("Group Created successfully")

           // var sql = `select userID,name,email,password from users where email="${email}"`;

        }
    });
})





module.exports = router;