var mssql = require('mssql');

var config = require('./connection_pool'); 
var displayHandler = require('./displayhandler');  

module.exports = {

    tableRows: ``,
    // выбор всех элементов и отображение в виде таблицы 
    getAllItems: function () {
		
        var self = this; 		
		self.tableRows = ``; 
		
		var request = new mssql.Request();  
		request.stream = true; 
		request.query("SELECT * FROM items"); 
		
		request.on('row', function(row){
			self.tableRows += ` <tr>
						<td>${row.name} </td>
						<td>${row.description}</td>
						<td>${row.completed ? 'yes' : 'no'}</td>
					</tr>` 
		})
		
		return request; 
    }, 
	insertItem: function (data, req, res) {
		

			var connection = new mssql.Connection(config); 
			connection.connect(function(err) { 		
		     var ps = new mssql.PreparedStatement(connection); 
			
			 // ps.input('name', mssql.Text); 
			 // ps.input('description', mssql.Text);
			 // ps.input('completed', mssql.Int);   
			
		
				 // name: data.name, 
				 // description: data.description, 
				 // completed: data.completed
			 // }
			
			  ps.prepare(`INSERT INTO items (name, description, completed) VALUES ('${data.name}','${data.description}', ${data.completed})`, function(err) {
				 ps.execute(function(err, data) {
					 console.log(err)  
					 e.emit('end'); 
					 ps.unprepare(); 

					displayHandler.displayItems(req, res); 
				 }) 
			 }) 

			 
			})
	
	
		//(/* [connection] */);
//'${data.name}', '${data.description}', ${data.completed})` 
		// request,input('name'); 
		// request.query("INSERT INTO items (name, description, completed) VALUES ('@name','3434', 4)"); 
		// request.on('error', function(err) {
			// console.log(err); 
		// })
		
		//return request; 
	}
}