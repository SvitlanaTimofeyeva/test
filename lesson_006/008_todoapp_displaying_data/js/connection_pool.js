﻿var mssql = require('mssql');

var config = {
	
	driver: 'tedious',   // драйвер mssql
	user: 'demo_user',   // пользователь базы данных
	password: '12345', 	 // пароль пользователя 
	server: 'localhost', // хост
	database: 'todos',    // имя бд
	port: 1433,			 // порт, на котором запущен sql server
    stream: true,
	pool: {
        max: 10, // максимальное допустимое количество соединений пула 
        min: 0,  // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 // время ожидания перед завершением неиспользуемого соединения 
    }
	
} 

module.exports = config;  