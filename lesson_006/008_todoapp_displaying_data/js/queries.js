var mssql = require('mssql');

module.exports = {

    tableRows: ``,
    // выбор всех элементов и отображение в виде таблицы 
    getAllItems: function () { 
		
        var self = this; 
		self.tableRows = ``; 
		
		var request = new mssql.Request();  

		request.query("SELECT * FROM items"); 
		
		request.on('row', function(row){
			self.tableRows += ` <tr>
						<td>${row.name} </td>
						<td>${row.description}</td>
						<td>${row.completed ? 'yes' : 'no'}</td>
					</tr>` 
		})
		
		return request; 
    }
}