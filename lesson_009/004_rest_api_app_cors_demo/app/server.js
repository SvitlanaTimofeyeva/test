var express = require('express');
var app = express();  

var http = require('http'); 
var path = require('path'); 

var bodyParser = require('body-parser'); 

app.use(bodyParser.json()); 

var port = process.env.port || 3000; 

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html')); 
}); 



// HTTP ������� � REST api 

// callback-������� ��� ��������� ����������� �������� 
var cb = function (response, res) {
    response.on('data', function (chunk) {
       
        res.write(chunk.toString());
    });

    response.on('end', function () {
        res.end();
    })
}

// ����������� ��� ��������
app.get('/all', function (req, res) {

    // GET-������
    var options = {
        host: 'localhost', 
        port: 1337, 
        method: 'GET', 
        path: '/todos/'

    } 

    var request = http.request(options, function (response) {
        cb(response, res)
    }); 
    request.end(); 
}) 

// ����������� ������� �� id 
app.get('/view/:id', function (req, res) {

     // GET-������
     var options = {
        host: 'localhost',
        port: 1337, 
        method: 'GET',
        path: '/todos/' + req.params.id
    }

     var request = http.request(options, function (response) {
         cb(response, res)
     });
     request.end(); 
}) 

// ������� ����� ������� 
app.post('/new', function (req, res) {

    // POST-������
     var options = {
        host: 'localhost',
        port: 1337, 
        method: 'POST',
		path: '/todos/new' ,
		headers: {
            'Content-Type': 'application/json'
        }
    }

     var request = http.request(options, function (response) {
         cb(response, res)
     });
     request.write(JSON.stringify(req.body));
     request.end();     
}) 

// ������������� ������� �� id 
app.post('/edit/:id', function (req, res) {

     // PUT-������
     var options = {
        host: 'localhost',
        port: 1337, 
        method: 'PUT',
        path: '/todos/' + req.params.id, 
        headers: {
            'Content-Type': 'application/json'
        }
    }

     var request = http.request(options, function (response) {
         cb(response, res)
     }); 

     request.write(JSON.stringify(req.body));
     request.end();     
})

// ������� ������� �� id 
app.get('/delete/:id', function (req, res) {

    // DELETE-������
     var options = {
        host: 'localhost',
        port: 1337, 
        method: 'DELETE', 
        path: '/todos/' + req.params.id 
    }

     var request = http.request(options, function (response) {
         cb(response, res)
     });
     request.end(); 
}) 

app.listen(port, function() {
	
	console.log('app running on port ' + port); 
})