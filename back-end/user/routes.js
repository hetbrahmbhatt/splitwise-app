var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var connection = require('../config/db-config').connection;


//signup
router.post('/signup', (req, res) => {
    var name = req.body.name;
    var email = req.body.email
    var password = req.body.password
    console.log(name);
    console.log(email);
    console.log(password);

    bcrypt.hash(password, 10, (err, hash) => {
        var sql = `insert into users(name,email,password) values(?,?,?)`;
        var values = [name, email, hash];
        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                if (err.code = "ER_DUP_ENTRY") {
                    res.status(400).send(' Duplicate entry for email')
                }
                res.status(500).end('Error');

            } else {
                res.writeHead(200, {
                    "Content-Type": "text/plain"
                });
                res.end("Successfully signed up");
            }

        });


    });
});



//login
router.post('/login', (req, res) => {
    var email = req.body.email
    var password = req.body.password
    var sql = `select userID,name,email,password from users where email="${email}"`;

    connection.query(sql, (err, results) => {
        if (err) {
            console.log(err);
        } else {
            if (results.length > 0) {
                if (bcrypt.compareSync(password, results[0].password)) {
                    console.log(results[0])
                    userdata = {
                        id: results[0].userID,
                        name: results[0].name,
                        email: results[0].email
                    }
                    req.session.user = email;
                    res.status(200).send(JSON.stringify(userdata));
                } else {
                    res.status(400).end("Invalid Credentials");
                }

            } else {
                res.status(400).end("User Not found");
            }
        }
    });

});
module.exports = router;