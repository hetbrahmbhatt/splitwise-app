var mysql = require( 'mysql' )
var pool = mysql.createPool( {
    host: 'localhost',
    user: 'root',
    password: 'masterpassword',
    database: 'test',
    connectionLimit: 10
} )

module.exports = {
    connection: pool
}
//TODO : Use it in the index.js file 