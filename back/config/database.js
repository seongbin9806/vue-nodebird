const mysql = require('mysql2/promise');
const pool = {
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '0000',
    database: 'vue-nodebird'
}

module.exports = {
    init: function () {
        return mysql.createPool(pool);
    },
    connect: function() {
        // console.log('mysql is connected successfully!');
    }
}