var cookieParser = require('cookie-parser');
var session = require('express-session');

// ����������� ������ express-mysql-session 
var MySQLStore = require('express-mysql-session')(session);

module.exports = {

    createStore: function () {

        var options = {
            // ��������� ���������� � �� 
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'session_test',

            checkExpirationInterval: 900000,
            expiration: 86400000
        };

        // �������� ��������� ��� ������ 
        return sessionStore = new MySQLStore(options); 
    }
}
