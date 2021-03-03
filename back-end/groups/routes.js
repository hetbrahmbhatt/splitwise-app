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
router.get('/totalgroups/:id', (req, res) => {
    var userID = req.params.id;
    console.log("here");
    var sql = `select mg.groupid,mg.name from master_group as mg inner join members as me on mg.groupid = me.ref_groupid where status = 2 and me.ref_userid = ${userID};`;
    connection.query(sql, (err, results) => {
        if (err) {

        }
        else {
            res.status(200).send(JSON.stringify(results));

        }
    })

});
router.post('/recentactivitybygroups/', (req, res) => {
    console.log("--------------")
    console.log(req.body);
    var userID = req.body.userID;
    var groupID = req.body.groupID;
    var orderBy = req.body.orderBy;
    var sql = null;
    if (groupID == null)
        sql = `SELECT mu.name as username,me.amount,me.createdat,me.ref_paidby,me.currency,mg.name,mg.groupid,mg.count,me.description,mg.image FROM splitwise.master_expense as me inner join users as mu on mu.userid = me.ref_paidby inner join master_group as mg on me.ref_groupid = mg.groupid where ref_groupid IN (select m.ref_groupid from members as m  inner join master_group as me on m.ref_groupid = me.groupid where status=2 and m.ref_userid = ${userID} ) order by createdat ${orderBy};`;
    else
        sql = `SELECT mu.name as username,me.amount,me.createdat,me.ref_paidby,me.currency,mg.name,mg.groupid,mg.count,me.description,mg.image FROM splitwise.master_expense as me inner join users as mu on mu.userid = me.ref_paidby inner join master_group as mg on me.ref_groupid = mg.groupid where ref_groupid IN (select m.ref_groupid from members as m  inner join master_group as me on m.ref_groupid = me.groupid where status=2 and m.ref_userid = ${userID} and groupid = ${groupID} ) order by createdat ${orderBy};`;
    // var sql = `select mg.groupid,mg.name from master_group as mg inner join members as me on mg.groupid = me.ref_groupid where status = 2 and me.ref_userid = ${userID};`;
    connection.query(sql, (err, results) => {
        if (err) {

        }
        else {
            res.status(200).send(JSON.stringify(results));

        }
    })

});
router.get('/description/:id', (req, res) => {
    var groupID = req.params.id;

    var sql = `select me.description,u.name,me.amount,me.createdat,me.currency from master_expense me inner join users  u on u.userid = me.ref_paidby where ref_groupid = ${groupID} order by createdat desc`;

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
        sql = `update members set status=2 where ref_userID=${userID} and ref_groupID = ${groupID};`;
        sql = sql + `update master_group set count = count + 1 where groupid = ${groupID};`;
    }
    else {
        sql = `update members set status=0 where ref_userID=${userID} and ref_groupID = ${groupID}`;

    }
    var values = [userID, groupID]
    console.log(sql);
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
            var values = [req.body.userID, results.insertId, 2, req.body.userID];
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
router.post('/leavegroup', (req, res) => {
    console.log(req.body)
    var userID = req.body.userID;
    var groupID = req.body.groupID;
    var sql = `select groupbalance from recent_activity where ref_userid = ${userID} and ref_groupid = ${groupID} and groupbalance!=0;`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.send(400).end("Something went wrong");
        }
        else {
            console.log(results);
            if (results.length <= 0) {
                console.log("object")
                var newsql = `update members set status=3 where ref_userID=${userID} and ref_groupID = ${groupID}`;
                connection.query(newsql, (err, results) => { });
                res.send(200).end("Hope you have a great time after leaving the group :)")
            }
            else {
                res.send(400);
            }
            // res.status(200).send(JSON.stringify(results));
        }
    });
});
router.get('/recentactivity/:id', (req, res) => {
    var userID = req.params.id;
    var sql = `SELECT mu.name as username,me.amount,me.createdat,me.ref_paidby,me.currency,mg.name,mg.groupid,mg.count,me.description,mg.image FROM splitwise.master_expense as me inner join users as mu on mu.userid = me.ref_paidby inner join master_group as mg on me.ref_groupid = mg.groupid where ref_groupid IN (select m.ref_groupid from members as m  inner join master_group as me on m.ref_groupid = me.groupid where status=2 and m.ref_userid = ${userID}) order by createdat desc;`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.send(400).end("Sorry! Nothing to display");
        }
        else {
            console.log(results);
            res.status(200).send(JSON.stringify(results));
        }
    });
});
router.post('/individualexpense/:id', async (req, res) => {
    console.log(req.body);
    console.log(req.params.id);
    groupID = req.params.id;
    var result = [];
    const results = req.body;
    for (let i = 0; i < results.length; i++) {
        var sql = `select sum(groupbalance),currency,ref_groupid,ref_userid,u.name from recent_activity as ra inner join users as u  on ra.ref_userid = u.userid   where ref_userid = ${results[i].ref_userid}  and ref_groupid = ${groupID} group by ref_groupid,currency ;`;
        await connection.query(sql, (err, sqlresults) => {
            if (err) {
                console.log(err);
                res.sendStatus(500);
                return;
            }
            else {
                for (let j = 0; j < sqlresults.length; j++) {
                    if (sqlresults[j]['sum(groupbalance)'] < 0) {
                        result.push(results[i].name + " owes " + sqlresults[j]['currency'] + ((-1) * sqlresults[j]['sum(groupbalance)']));
                        // x.set(results[i].ref_userid,x.get(results[i].ref_userid) + "/" + results[i].name + " owes " + sqlresults[j]['currency'] + ((-1) * sqlresults[j]['sum(groupbalance)']) );

                    }
                    else {
                        result.push(results[i].name + " gets back " + sqlresults[j]['currency'] + ((1) * sqlresults[j]['sum(groupbalance)']));

                        // x.set(results[i].ref_userid,x.get(results[i].ref_userid) + "/" + results[i].name + " gets back " + sqlresults[j]['currency'] + sqlresults[j]['sum(groupbalance)'] );
                    }
                    // if(x.has(results[i].ref_userid)){
                    //     if(sqlresults[j]['sum(groupbalance)'] < 0){
                    //         x.set(results[i].ref_userid,x.get(results[i].ref_userid) + "/" + results[i].name + " owes " + sqlresults[j]['currency'] + ((-1) * sqlresults[j]['sum(groupbalance)']) );

                    //     }
                    //     else{
                    //         x.set(results[i].ref_userid,x.get(results[i].ref_userid) + "/" + results[i].name + " gets back " + sqlresults[j]['currency'] + sqlresults[j]['sum(groupbalance)'] );
                    //     }
                    // }
                    // else{
                    //     if(sqlresults[j]['sum(groupbalance)'] < 0){
                    //         x.set(results[i].ref_userid,results[i].name + " owes " + sqlresults[j]['currency'] + ((-1) * sqlresults[j]['sum(groupbalance)']) );
                    //     }
                    //     else
                    //     {
                    //         x.set(results[i].ref_userid, results[i].name + " gets back " + sqlresults[j]['currency'] + sqlresults[j]['sum(groupbalance)'] );
                    //     }
                    // }
                }
                res.write(result);
            }
        });
    }
});

router.get('/individualdata/:id', async (req, res) => {
    var result = []
    var resultsx = null;
    var groupID = req.params.id;
    var sql = `select me.ref_userid,mu.name from master_group as mg inner join members as me on mg.groupid = me.ref_groupid inner join users as mu on me.ref_userid = mu.userid  where status=2 and mg.groupid = ${groupID};`;
    await connection.query(sql, (err, results) => {
        if (err) {
            // res.send(400).end("Sorry! Nothing to display");
        }
        else {
            res.status(200).send(JSON.stringify(results))
        }

    });
});
router.post('/expenses', (req, res) => {
    console.log(req);
    let timestamp = null;
    var totalbalance = null;
    var oldtBalance = 0;
    var ref_expenseid = null;
    console.log(req.body);
    var groupID = req.body.groupID;
    var currency = req.body.currency;
    var ref_paidby = req.body.userID;
    var description = req.body.description;
    var amount = req.body.amount;
    let dateObject = new Date(new Date());
    let date = dateObject.getDate().toString();
    let month = (dateObject.getMonth() + 1).toString();
    let year = dateObject.getFullYear().toString();
    let time = dateObject.getHours().toString() + "-" + dateObject.getMinutes().toString() + "-" + dateObject.getSeconds().toString();
    timestamp = year + "-" + month + "-" + date + "-" + time;
    //Getting the total group members
    var sql = `SELECT m.ref_userid,invitedby FROM splitwise.master_group as g inner join members as m on g.groupid = m.ref_groupid where status=2 and ref_groupid = ${groupID}`
    var group_members = [];
    var group_members2 = [];
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            res.status(400).end("Error:", err);
        }
        else {
            for (let i = 0; i < results.length; i++) {
                group_members.push(results[i].ref_userid);
                group_members2.push(results[i].ref_userid);
            }
            var values = [groupID, ref_paidby, amount, description, req.body.currency, timestamp];
            var sql = `insert into master_expense(ref_groupid,ref_paidby,amount,description,currency,createdat) values(?,?,?,?,?,?);`
            connection.query(sql, values, (err, results, fields) => {
                if (err) {
                    console.log(err);
                    res.status(400).send("Error");
                }
                else {
                    var total_Members = group_members2.length;
                    dividedAmount = amount / total_groupMembers;
                    ref_expenseid = results.insertId;
                    console.log("Here --------->");
                    for (let i = 0; i < group_members2.length; i++) {
                        var sql = `select * from recent_activity where ref_userid = ${group_members2[i]} and ref_groupid = ${groupID} and currency = '${req.body.currency}' order by createdat desc limit 1`;
                        connection.query(sql, (err, results, fields) => {
                            if (err) {
                                console.log(err);
                                // res.status(400).send("Error");
                            }
                            else {
                                var sql = `select totalbalance from recent_activity where ref_userid = ${group_members2[i]}  and currency = '${req.body.currency}' order by createdat desc limit 1`;
                                connection.query(sql, (err, results, fields) => {
                                    if (err) {

                                    }
                                    else {
                                        if (results.length > 0)
                                            oldtBalance = results[0].totalbalance;
                                    }
                                });
                                if (results.length > 0) {
                                    if (group_members2[i] == req.body.userID) {
                                        groupBalance = dividedAmount * (total_Members - 1);
                                    }
                                    else {
                                        groupBalance = -(dividedAmount);
                                    }
                                    var oldgBalance = results[0].groupbalance;
                                    var newgBalance = parseFloat(Number(oldgBalance) + Number(groupBalance));
                                    console.log(newgBalance);
                                    var newtotalbalance = parseFloat(Number(oldtBalance) + Number(groupBalance));
                                    console.log(newtotalbalance);
                                    var recentactivityid = results[0].recentactivityid;
                                    var sql = `update recent_activity set groupbalance=${newgBalance},totalbalance=${newtotalbalance} where recentactivityid=${recentactivityid}`;
                                    connection.query(sql, (err, results) => {
                                        if (err) {
                                            console.log(err);
                                            //res.status(400).end("Error:", err);
                                        }
                                        else {
                                            console.log(results);
                                        }
                                    });
                                }
                                else {
                                    if (group_members2[i] == req.body.userID) {
                                        groupBalance = dividedAmount * (total_Members - 1);
                                    }
                                    else {
                                        groupBalance = -(dividedAmount);
                                    }
                                    var values = [ref_expenseid, group_members2[i], amount, groupID, currency, groupBalance, groupBalance, timestamp, null];
                                    var sql = `insert into recent_activity(ref_expenseid,ref_userid,amount,ref_groupid,currency,groupbalance,totalbalance,createdat,updatedat) values(?,?,?,?,?,?,?,?,?);`
                                    connection.query(sql, values, (err, results, fields) => {
                                        if (err) {
                                            console.log(err);
                                            // res.status(400).send("Error");
                                        }
                                        else {

                                        }
                                    });
                                }

                            }
                        });
                    }
                }
            })
            var total_groupMembers = group_members.length;
            dividedAmount = amount / total_groupMembers;
            const index = group_members.indexOf(Number(ref_paidby));
            if (index > -1) {
                group_members.splice(index, 1);
            }
            for (let i = 0; i < group_members.length; i++) {
                var userid1 = group_members[i];
                var values = null;
                var userid2 = ref_paidby;
                var currency = req.body.currency;
                var ref_groupid = req.body.ref_groupid;
                if (userid1 > userid2) {
                    values = [userid2, userid1, currency, dividedAmount, req.body.groupID, timestamp];

                }
                else {
                    values = [userid1, userid2, currency, dividedAmount, req.body.groupID, timestamp];

                }
                var sql = null;

                if (userid1 > userid2) {
                    sql = `select * from debt where userid1=${userid2} and userid2=${userid1} and currency='${currency}' and ref_groupid= ${groupID}`;
                }
                else {
                    sql = `select * from debt where userid1=${userid1} and userid2=${userid2} and currency='${currency}' and ref_groupid= ${groupID}`;

                }
                connection.query(sql, values, (err, results, fields) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var userid1 = group_members[i];
                        var userid2 = req.body.userID;
                        var sql = null
                        var values = null
                        if (results.length > 0) {
                            if (results[0].userid2 == req.body.userID) {
                                var sql = `update debt set amount = amount + ${dividedAmount} where debtid = ${results[0].debtid}`;
                                connection.query(sql, (err, results, fields) => {
                                    if (results.length > 0) {
                                        console.log("bvjlhfbhbebfcdjdfbchlebdfleqkf Over here")
                                    }
                                    else {
                                        // console.log(results);
                                    }
                                });
                            }
                            else {
                                var sql = `update debt set amount = amount - ${dividedAmount} where debtid = ${results[0].debtid}`;
                                connection.query(sql, (err, results, fields) => {
                                    if (results.length > 0) {
                                        // console.log("bvjlhfbhbebfcdjdfbchlebdfleqkf Over here")
                                    }
                                    else {
                                        // console.log(results);
                                    }
                                });
                            }
                        }
                        else {
                            if (userid1 > userid2) {
                                sql = `insert into debt(userid1,userid2,currency,amount,ref_groupid,createdat) values(?,?,?,?,?,?);`;
                                values = [userid2, userid1, currency, -dividedAmount, req.body.groupID, timestamp];

                            }
                            else {
                                sql = `insert into debt(userid1,userid2,currency,amount,ref_groupid,createdat) values(?,?,?,?,?,?);`;
                                values = [userid1, userid2, currency, dividedAmount, req.body.groupID, timestamp];

                            }
                            connection.query(sql, values, (err, results, fields) => {
                                if (results.length > 0) {
                                    console.log("Over here")
                                }
                                else {
                                    // console.log(results);
                                }
                            });
                        }
                        // var sql = `update debt set where groupID=${groupID}`;

                    }
                });
            }

        }
    });
});

module.exports = router;