var express = require('express');
var router = express.Router();
var connection = require('../config/db-config').connection;

router.get('/negtotalbalance/:id', (req, res) => {
    var userID = req.params.id;
    console.log(userID);
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
    var sql = `select u.userid as from_user,u2.userid as to_user,concat(u2.name," owes ",u.name," ",concat(d.currency,-1*d.amount))as string,mg.name from debt as d inner join users as u on userid1 = userid inner join users as u2 on d.userid2 = u2.userid  inner join master_group as mg on d.ref_groupid = mg.groupid where (userid1=${userID}) and d.amount<0;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});

router.get('/totalgiving/:id', (req, res) => {
    var userID = req.params.id;
    console.log(userID);
    var result = []
    var sql = `select u.userid as from_user,u2.userid as to_user,concat(u2.name," owes ",u.name," ",concat(d.currency,d.amount))as string,mg.name from debt as d inner join users as u on userid1 = userid inner join users as u2 on d.userid2 = u2.userid  inner join master_group as mg on d.ref_groupid = mg.groupid where (userid2=${userID}) and d.amount<0;`;
    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        }
        else {
            res.status(200).send(JSON.stringify(results));
        }
    });
});
module.exports = router;
//


