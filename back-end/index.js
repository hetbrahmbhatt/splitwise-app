const PORT = 3003;
var cors = require( 'cors' );
var express = require( 'express' );
var session = require( "express-session" );
var user = require( './user/routes')
var bodyParser = require( 'body-parser' );
var mysql = require( 'mysql');
var cookieParser = require( "cookie-parser" );
const app = express();
//Session management
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'masterpassword',
    database : 'test',
    port : 3306
});
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded( { extended: false } ) );
app.use( cookieParser() );
app.use( express.static( 'public' ) )
app.use( cors( { origin: "http://localhost:3002", credentials: true } ) );
app.use(
    session( {
        key: 'user_sid',
        secret: "lab_1",
        resave: false,
        saveUninitialized: false,
        cookie: {
            expires: 6000000
        }
    } )
);
db.connect((error) =>{
    if(error)
    {
        throw error;
    }
    console.log("Mysql connected");
})
app.get('/createdb',(req,res) => {
    let mysql = 'CREATE DATABASE MYSQL';
    db.query(mysql ,(err,result)=>{
        if(err)console.log("object");
        console.log(result);
        res.send("Database created");
    })
    db.end();
})
app.listen( PORT, () => {
    console.log( "Server listening on port: ", PORT );
} );


app.use( '/users', user );


app.get( '/', ( req, res ) => {
    res.send( 'Welcome to Splitwise - Easiest way to split expenses' );
} );
