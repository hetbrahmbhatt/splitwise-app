var express = require( 'express' );
var bcrypt = require( 'bcrypt' );
var router = express.Router();
var connection = require( '../config/db-config' ).connection;


//signup
router.post( '/signup', ( req, res ) => {
    var name = req.body.name;
    var email = req.body.email
    var password = req.body.password
    console.log(name);
    console.log(email);
    console.log(password);

    bcrypt.hash( password, 10, ( err, hash ) => {
        var sql = `insert into users(name,email,password) values(?,?,?)`;
        var values = [ name, email, hash ];
        connection.query( sql, values, ( err, results, fields ) => {
            if ( err ) {
                console.log( err );
                res.status( 500 ).end( 'Error' )
            } else {
                res.writeHead( 200, {
                    "Content-Type": "text/plain"
                } );
                res.end( "Successfully signed up" );
            }

        } );


    } );


} );

module.exports = router;