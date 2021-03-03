var mysql = require( 'mysql' )
var pool = mysql.createPool( {
    host: 'localhost',
    user: 'root',
    password: 'masterpassword',
    database: 'splitwise',
    connectionLimit: 10,
    multipleStatements: true
} )

module.exports = {
    connection: pool
}
//TODO : Use it in the index.js file 