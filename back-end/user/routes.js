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
                // If duplicate entry, send the corresponding message
                if (err.sqlMessage.includes("Duplicate entry")) {
                    res.status(400).send(' Duplicate entry for email')
                }
                res.status(500).end('Error');

            } else {
                var sql = `select userID,name,email,password,defaultcurrency from users where email="${email}"`;
                connection.query(sql, (err, results) => {
                    if (err) {
                        console.log(err);
                    }
                    else if (results.length > 0) {
                        var userdata = null;
                        userdata = {
                            id: results[0].userID,
                            name: results[0].name,
                            email: results[0].email,
                            currency: results[0].defaultcurrency
                        }
                        console.log(userdata);
                        req.session.user = email;

                    }
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
    var sql = `select userID,name,email,password,defaultcurrency from users where email="${email}"`;

    connection.query(sql, (err, results) => {
        if (err) {
            res.status(400).end("Invalid Credentials");
        } else {
            if (results.length > 0) {
                if (bcrypt.compareSync(password, results[0].password)) {
                    var userdata = null;
                    userdata = {
                        id: results[0].userID,
                        name: results[0].name,
                        email: results[0].email,
                        currency : results[0].defaultcurrency
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
router.get('/userbyid/:id', (req, res) => {
    console.log("Over here");
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
//get all users
router.get('/all', (req, res) => {
    var sql = `select * from users`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).end(err);
        } else {
            res.status(200).send(JSON.stringify(results));
        }

    });
});

//get users based on search
router.get('/searchbyname', (req, res) => {
    var sql = `select userID,name from users where name LIKE '${req.query.name_like}%'`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).end(err);
        } else {
            console.log("object");
            res.status(200).send(JSON.stringify(results));
        }

    });
});
router.get('/searchbyemail', (req, res) => {
    console.log("Here");
    var sql = `select userID,email from users where email LIKE '${req.query.email_like}%'`;
    connection.query(sql, (err, results) => {
        if (err) {
            res.status(500).end(err);
        } else {
            console.log("object");
            res.status(200).send(JSON.stringify(results));
        }

    });
});

router.put('/editprofile', (req, res) => {
    var userID = req.body.userID;
    console.log(userID);
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
            if (err.sqlMessage.includes("Duplicate entry")) {
                res.status(400).send('Email already exists');
            }
            res.status(400).end("Error:", err).sqlMessage;
        } else {
            res.status(200).send(JSON.stringify(results));
        }

    });
})

router.post('/uploadprofileimage', (req, res) => {
    if (req.files === null) {
        return res.status(400).send('No File Upload');
    }
    console.log("object");
    const file = req.files.profileImage;
    //Get the userID,file name from frontend
    var userID = req.files.profileImage.name.split(',')[1];
    const fileName = req.files.profileImage.name.split(',')[0];
    var pathToImage = path.join(__dirname, '../public');
    const filePathwithoutfileName = pathToImage + '/images/profilepics/' + userID;
    const filePath = pathToImage + '/images/profilepics/' + userID + '/' + fileName;
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
            var sql = `update users set image='${fileName}' where userID=${userID}`;
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
module.exports = router;