var express = require('express');
var bcrypt = require('bcrypt');
var router = express.Router();
var connection = require('../config/db-config').connection;
var _ = require('lodash');
var path = require('path');
var fs = require('fs');
//signup
router.post('/signup', (req, res) => {
    var name = req.body.name;
    var email = req.body.email
    var password = req.body.password
    bcrypt.hash(password, 10, (err, hash) => {
        var sql = `insert into users(name,email,password)
         values(?,?,?);`
        var values = [name, email, hash];
        connection.query(sql, values, (err, results, fields) => {
            if (err) {
                if (err.code = "ER_DUP_ENTRY") {
                    res.status(400).send(' Duplicate entry for email')
                }
                res.status(500).end('Error');

            } else {
                var sql = `select userID,name,email,password from users where email="${email}"`;
                connection.query(sql, (err, results) => {
                    if(err){
                        console.log(err);
                    }
                    else if(results.length >0){
                        userdata = {
                            id: results[0].userID,
                            name: results[0].name,
                            email: results[0].email
                        }
                        req.session.user = email;

                    }
                    console.log(results[0]);
                    req.session.user = email;
                    res.status(200).send(JSON.stringify(userdata));
                });

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
//get user about by id 
router.get('/:id', (req, res) => {
    var id = req.params.id;

    var sql = `select * from users where userID="${id}"`;
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

router.put('/editprofile', (req, res) => {
    var userID = req.body.userID;
    var name = req.body.name;
    var email = req.body.email;
    var defaultcurrency = req.body.defaultcurrency;
    var phoneno = req.body.phoneno;
    var timezone = req.body.timezone;
    var language = req.body.language;
    var sql = `update users set name=?,email=?,phoneno=?,timezone=?,language=?,defaultcurrency=? where userID=${userID}`;
    var values = [name, email, phoneno, timezone, language, defaultcurrency]
    connection.query(sql, values, (err, results) => {
        if (err) {
            console.log(err);
            res.status(400).end("Error:", err);
        } else {
            res.status(200).send(JSON.stringify(results));
        }

    });
})

router.post('/uploadprofileimage', (req, res) => {
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    console.log(req.files.profileImage.name);
    const file = req.files.profileImage;
    var userID = req.files.profileImage.name.split(',')[1];
    console.log(userID);
    const fileName = req.files.profileImage.name.split(',')[0];
    var x = path.join(__dirname, '../public');
    console.log(x);
    console.log(__dirname);
    const filePathwithoutfileName = x + '/images/profilepics/' + userID ;
    const filePath = x + '/images/profilepics/' + userID + '/' + fileName;
    if (!fs.existsSync(filePathwithoutfileName)){
        fs.mkdirSync(filePathwithoutfileName);
    }
    console.log(filePath);
    file.mv(filePath, err => {
        if (err) {
            return res.status(500).end(err);
        }
        else {
            var sql = `update users set image='${fileName}' where userID=${userID}`;
            connection.query(sql, (err, results) => {
                if (err) {
                    console.log(err);
                    res.status(400).end("Error:", err);
                }
            });
        }
    })
    res.json({
        fileName: fileName,
        filePath: filePath
    })
});
module.exports = router;