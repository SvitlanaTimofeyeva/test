var mssql = require('mssql');
var config = require('./connection_pool'); 

var queries = require('./queries');  


module.exports = {
    displayItems: function(req, res) {  

		
		mssql.connect(config, function(err) {
			var query = queries.getAllItems()
	
			query.on('done', function(affected) { 
				res.render('index', { data:  queries.tableRows }); 
			})		

					
		}) 

    }
}