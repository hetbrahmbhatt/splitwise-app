var mysql = require( 'mysql' )
var pool = mysql.createPool( {
    host: 'database-1.ce4zgp6haaoa.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'masterpassword',
    database: 'splitwise',
    connectionLimit: 10,
    multipleStatements: true
} )
// var connection = mysql.createConnection( {
//     host: 'database-1.ce4zgp6haaoa.us-east-2.rds.amazonaws.com',
//     user: 'admin',
//     password: 'masterpassword',
//     database: 'splitwise',
//     multipleStatements: true
// } )
// connection.connect();
module.exports = {
    connection: pool
}
