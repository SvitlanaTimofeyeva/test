var mssql = require('mssql');
var displayHandler = require('./displayhandler');  
var connection = require('./config'); 

module.exports = {

    // selectedRow: '', 
    // // поиск элемента по id 
    // findItemById: function (id, connection) {
        // var self = this; 
        // var query = connection.query('SELECT * FROM `items` WHERE id=?', [id], function (err, rows) {
            // if (err) console.log(err);
            // self.selectedRow = rows[0]; 
        // })
        // return query;
    // },
    // // редактирование элемента 
    // updateItem: function (data, connection) {

        // // форматирование запроса
        // var sql = 'UPDATE `items` SET name=?, description=?, completed=? WHERE id=?';
        // var inserts = [data.name, data.description, data.completed, data.id];
        // sql = mysql.format(sql, inserts);

        // var query = connection.query(sql, function (err) {
            // if (err) {
                // console.log(err)
            // } else {
                // console.log('database updated');
            // }
        // }); 
        // return query; 
    // },
    tableRows: '',
    // выбор всех элементов и отображение в виде таблицы 
    getAllItems: function (req, res) {
		
        var self = this; 		
		self.tableRows = ``; 
		connection.connect(function(err) {
			var request = new mssql.Request(connection);  
			request.stream = true; 
			request.query("SELECT * FROM items"); 
			
			request.on('row', function(row){ 
	
				self.tableRows += ` <tr>
							<td>${row.name} </td>
							<td>${row.description}</td>
							<td>${row.completed ? 'yes' : 'no'}</td>
						</tr>` 
				}); 
			
			request.on('done', function(affected) { 
				console.log('show_items'); 
				if (req.url == '/') {
                    res.render('index', { data:  self.tableRows, buttons: false });
                } else {
                    res.render('index', { data: self.tableRows, buttons: true });
                }
			})		

		})
    },
	// добавить элемент в бд
	insertItem: function (data, req, res) {
		

			connection.connect(function(err){

					var inserts = {
						
						name: data.name, 
						description: data.description, 
						completed: parseInt(data.completed)
					}
				
				   var ps = new mssql.PreparedStatement(connection);  
				   
				   ps.input('name', mssql.Text); 
				   ps.input('description', mssql.Text); 
				   ps.input('completed', mssql.Int); 
				   
				   ps.prepare("INSERT INTO items (name, description, completed) VALUES (@name , @description, @completed)", function(err) { 
						if (err) console.log(err); 
					    var request = ps.execute(inserts, function(err) { 
						
							console.log(err); 
							console.log('add item'); 

						}); 
				
				
				})
			})

	}

}