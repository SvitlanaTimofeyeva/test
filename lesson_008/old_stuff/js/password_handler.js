var crypto = require('crypto');
var mysql = require('mysql'); 

module.exports = {
    // ����������� ������
    encryptPassword: function (password) {
        var hash = crypto.createHmac('sha1', 'abc').update(password).digest('hex'); 
        return hash;
    },
    // �������� ������ 
    checkPassword: function (password) { 

        var connection = mysql.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'users'
        });

        connection.connect(function (err) { if (err) console.log(err) });

        var sql = 'SELECT * FROM `users` WHERE passwordHash=?'; 
        var inserts = this.encryptPassword(password);
        var sql = mysql.format(sql, inserts);

        var query = connection.query(sql); 
        return query; 
    }
}