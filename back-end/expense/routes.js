var express = require('express');
var router = express.Router();
var connection = require('../config/db-config').connection;

router.get('/negtotalbalance/:id', (req, res) => {
    var userID = req.params.id;
    var result = []
    var sql = `select CONCAT(currency, -1*sum(groupbalance)) as groupBalance from recent_activity where ref_userid = ${userID} and groupbalance < 0 group by currency;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < results.length; i++) {
                result.push(results[i].groupBalance)
            }
            res.status(200).send(JSON.stringify(result.join(",")));
        }
    });
});
router.get('/postotalbalance/:id', (req, res) => {
    var userID = req.params.id;
    console.log(userID);
    var result = []
    var sql = `select CONCAT(currency, sum(groupbalance)) as groupBalance from recent_activity where ref_userid = ${userID} and groupbalance > 0 group by currency;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < results.length; i++) {
                result.push(results[i].groupBalance)
            }
            res.status(200).send(JSON.stringify(result.join(",")));
        }
    });
});
router.get('/totalbalance/:id', (req, res) => {
    var userID = req.params.id;
    console.log(userID);
    var result = []
    var sql = `select CONCAT(currency, sum(groupbalance)) as groupBalance from recent_activity where ref_userid = ${userID}  group by currency;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            for (let i = 0; i < results.length; i++) {
                result.push(results[i].groupBalance)
            }
            res.status(200).send(JSON.stringify(result.join(",")));
        }
    });
});
router.get('/totalowing/:id', (req, res) => {
    var userID = req.params.id;
    console.log(userID);
    var result = []
    var sql = `select d.userid1,d.userid2,d.ref_groupid,concat(u.name,"  owes you ") as totalOwe,concat(d.currency,-1*d.amount) as tamount,mg.name,d.currency,u.image,d.amount from debt as d inner join users as u on d.userid2 = u.userid inner join master_group as mg on d.ref_groupid=mg.groupid where d.userid1 = ${userID} and amount <0 
    UNION ALL
    select d.userid1,d.userid2,d.ref_groupid,concat(u.name,"  owes you ") as totalOwe, concat(d.currency, d.amount) as tamount,mg.name,d.currency,u.image,d.amount  from debt as d inner join users as u on d.userid1 = u.userid inner join master_group as mg on d.ref_groupid = mg.groupid where d.userid2 = ${userID} and amount > 0;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});
router.get('/totalinternaldebt/:id', (req, res) => {
    var groupID = req.params.id;
    var sql = `select u.name as lendername,u2.name as lendeename,d.amount,d.currency from debt as d inner join users as u on d.userid1 = u.userid inner join users as u2 on d.userid2 = u2.userid where ref_groupid = ${groupID} and d.amount!=0;`;
    connection.query(sql, (err, results) => {
        if(err){

        }
        else{
            res.status(200).send(JSON.stringify(results))
        }
    });
});
router.get('/totalgiving/:id', (req, res) => {
    var userID = req.params.id;
    console.log("HI", userID);
    var result = []
    var sql = `select d.userid1,d.userid2,d.ref_groupid,concat((" you owe ") ,u.name) as totalOwe,concat(d.currency,d.amount) as tamount,mg.name,d.currency,u.image,d.currency,d.amount from debt as d inner join users as u on d.userid2 = u.userid inner join master_group as mg on d.ref_groupid=mg.groupid where d.userid1 = ${userID} and amount > 0 
    UNION ALL
    select d.userid1,d.userid2,d.ref_groupid,concat((" you owe  "),u.name )as totalOwe, concat(d.currency, -1*d.amount) as tamount,mg.name,d.currency,u.image,d.currency,d.amount  from debt as d inner join users as u on d.userid1 = u.userid inner join master_group as mg on d.ref_groupid = mg.groupid where d.userid2 = ${userID} and amount < 0;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});
router.post('/owingsettleup', (req, res) => {
    console.log(req.body);
    let dateObject = new Date(new Date());
    let date = dateObject.getDate().toString();
    let month = (dateObject.getMonth() + 1).toString();
    let year = dateObject.getFullYear().toString();
    let time = dateObject.getHours().toString() + "-" + dateObject.getMinutes().toString() + "-" + dateObject.getSeconds().toString();
    timestamp = year + "-" + month + "-" + date + "-" + time;
    var userid1 = null;
    var userid2 = null;
    var amountToUpdate = 0;
    if (Number(req.body.amount) > 0) {
        amountToUpdate = req.body.amount;
    }
    else {
        amountToUpdate = -1 * (req.body.amount);

    }
    var sessionID = Number(req.body.sessionID);

    if (Number(req.body.userid1) < req.body.userid2) {
        userid1 = req.body.userid1;
        userid2 = req.body.userid2
    } else {
        userid1 = req.body.userid2;
        userid2 = req.body.userid1;
    }
    var anotherid = null;
    if (sessionID == userid1) {
        anotherid = userid2
    }
    else {
        anotherid = userid1;
    }
    var sql = `update debt set amount=0,currency=null where userid1 = ${userid1} and userid2 = ${userid2} and ref_groupid = ${req.body.ref_groupid} and currency ='${req.body.currency}';`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            var sql = `insert into master_expense(ref_groupid,ref_paidby,settleFlag,currency,createdat) values(?,?,?,?,?);`
            var values = [req.body.ref_groupid, userid1, userid2, req.body.tamount,timestamp];
            connection.query(sql, values, (err, results) => {
                if (err) {
                    console.log(err);
                }
                else {
                    var sql = `insert into recent_activity(ref_expenseid,ref_userid,ref_groupid,createdat) values(?,?,?,?);`
                    var values = [results.insertId, sessionID, req.body.ref_groupid,timestamp];
                    connection.query(sql, values, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var sql = ` update recent_activity set groupbalance = groupbalance - ${amountToUpdate} where ref_userid = ${sessionID} and currency = '${req.body.currency}' and ref_groupid=${req.body.ref_groupid};update recent_activity set groupbalance = groupbalance + ${amountToUpdate} where ref_userid = ${anotherid} and currency = '${req.body.currency}' and ref_groupid=${req.body.ref_groupid}`;
                            connection.query(sql, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("here");
                                    res.send(200);
                                }
                            });

                        }
                    });
                }
            });
        }
    });

});
router.post('/givingsettleup', (req, res) => {
    console.log(req.body);
    let dateObject = new Date(new Date());
    let date = dateObject.getDate().toString();
    let month = (dateObject.getMonth() + 1).toString();
    let year = dateObject.getFullYear().toString();
    let time = dateObject.getHours().toString() + "-" + dateObject.getMinutes().toString() + "-" + dateObject.getSeconds().toString();
    timestamp = year + "-" + month + "-" + date + "-" + time;
    var userid1 = null;
    var userid2 = null;
    var amountToUpdate = 0;
    if (Number(req.body.amount) > 0) {
        amountToUpdate = req.body.amount;
    }
    else {
        amountToUpdate = -1 * (req.body.amount);

    }
    var sessionID = Number(req.body.sessionID);
    console.log(Number(sessionID));
    console.log(req.body);
    console.log(amountToUpdate);
    if (Number(req.body.userid1) < Number(req.body.userid2)) {
        userid1 = Number(req.body.userid1);
        userid2 = Number(req.body.userid2);
    } else {
        userid1 = Number(req.body.userid2);
        userid2 = Number(req.body.userid1);
    }
    var anotherid = null;
    if (Number(sessionID) == Number(userid1)) {
        anotherid = Number(userid2)
    }
    else {
        anotherid = Number(userid1);
    }
    console.log(userid1);
    console.log(userid2);
    var sql = `update debt set amount=0,currency=null where userid1 = ${userid1} and userid2 = ${userid2} and ref_groupid = ${req.body.ref_groupid} and currency ='${req.body.currency}';`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            var sql = `insert into master_expense(ref_groupid,ref_paidby,settleFlag,currency,createdat) values(?,?,?,?,?);`
            var values = [req.body.ref_groupid, userid1, userid2, req.body.tamount,timestamp];
            connection.query(sql, values, (err, results) => {
                if (err) {
                    console.log(err);
                }
                else {
                    var sql = `insert into recent_activity(ref_expenseid,ref_userid,ref_groupid,createdat) values(?,?,?,?);`
                    var values = [results.insertId, sessionID, req.body.ref_groupid,timestamp];
                    connection.query(sql, values, (err, results) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var sql = `update recent_activity set groupbalance = groupbalance + ${amountToUpdate} where ref_userid = ${sessionID} and currency = '${req.body.currency}' and ref_groupid=${req.body.ref_groupid};update recent_activity set groupbalance = groupbalance - ${amountToUpdate} where ref_userid = ${anotherid} and currency = '${req.body.currency}' and ref_groupid=${req.body.ref_groupid}`;
                            connection.query(sql, (err, results) => {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    console.log("here");
                                    res.end();
                                }
                            });

                        }
                    });
                }
            });
        }
    });

});
module.exports = router;
//


