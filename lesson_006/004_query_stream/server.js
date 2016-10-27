var express  = require('express'); 
var app = express(); 

var port = process.env.port || 1337; 

var mssql = require('mssql'); 


// параметры соединения с бд
var config = {
	
	driver: 'tedious',   // драйвер mssql
	user: 'demo_user',   // пользователь базы данных
	password: '12345', 	 // пароль пользователя 
	server: 'localhost', // хост
	database: 'demo',    // имя бд
	port: 1433,			 // порт, на котором запущен sql server
    stream: true,
	pool: {
        max: 10, // максимальное допустимое количество соединений пула 
        min: 0,  // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 // время ожидания перед завершением неиспользуемого соединения 
    }
	
} 


app.use(function(req, res) { 
	
	mssql.connect(config, function(err) {
		
		var html = ``; 
		
		// для постепенной обработки данных по мере их поступления в node-mssql используется метод query и обработчики событий 
		
		var request = new mssql.Request(); 
		
		request.stream = true; // включить режим потока данных
		request.query('select * from items'); 

		// событие обработки колонки таблицы бд 
		request.on('recordset', function(columns) {
			console.log('-----recordset------'); 
			console.log(columns); 
			console.log('--------------------')
		});

		// событие обработки ряда таблицы бд 
		request.on('row', function(row) { 
		
			html += `<h2>${row.id} ${row.name} ${row.description}</h2>`
		
			console.log('-----recordset------'); 
			console.log(row); 
			console.log('--------------------')
		});

		// обработчик ошибок 
		request.on('error', function(err) {
			console.log(err); 
		});

		// обработчик события завершения запроса 
		request.on('done', function(affected) {  
			res.send(html); 
			console.log('done');  
		});
	});
	
});

app.listen(port, function() { 

	console.log('app listening on port ' + port); 

}); 