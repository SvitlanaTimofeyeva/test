var express = require('express');
var app = express();

var http = require('http'); 

var cookieParser = require('cookie-parser');
var session = require('express-session');

var path = require('path');
var bodyParser = require('body-parser');

var passwordHandler = require(path.join(__dirname, '/js/password_handler'));
var signupHandler = require(path.join(__dirname, '/js/signup'));
var loginHandler = require(path.join(__dirname, '/js/login'));
var sessionHandler = require(path.join(__dirname, '/js/session_handler')); 

// создание store для сессии 
var sessionStore = sessionHandler.createStore(); 
// создание сессии 
app.use(cookieParser());
app.use(session({

    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    store: sessionStore
}));

// установка генератора шаблонов 
app.set('views', './pages');
app.set('view engine', 'ejs');

// middleware для обработки данных POST запросов 
var jsonParser = bodyParser.json();
app.use(jsonParser);  

// подгрузка статических файлов из папки pages 
app.use(express.static(path.join(__dirname, 'pages')));

app.get('/', function (req, res) {
    res.render('index'); 
});

app.get('/signup', function (req, res) {
    res.render('signup.ejs');
});

app.get('/login', function (req, res) {
    res.render('login.ejs');
}); 

app.get('/check', function (req, res) {
    console.log(req.session)
    if (req.session.isLoggedIn) {
        res.set('Content-Type', 'text/html'); 
        res.send(`<h2>User ${req.session.userName} is logged in! </h2>`)
    } else {
        res.send('<h2>Not Logged In</h2>')
    }
})

// регистрация нового пользователя 
app.post('/signup', function (req, res) {
    var passwordHash = passwordHandler.encryptPassword(req.body.password);

    var newUser = {
        username: req.body.username,
        passwordHash: passwordHash
    }
    console.log(newUser)
    var query = signupHandler.addUser(newUser);

    query.on('end', function () {
        res.redirect('/');
        console.log('new user registered');
    });

    query.on('error', function (err) {
        console.log('signup error!'); 
    }); 
});


// авторизация пользователя 
app.post('/login', function (req, res) {
   // res.redirect('/')
    var isValidPass = ''; 
    var isValidName = '';  

    // проверить пароль
    var checkPassQuery = passwordHandler.checkPassword(req.body.password);
    checkPassQuery.on('result', function () {

        isValidPass = true;

        // проверить имя пользователя 
        var checkNameQuery = loginHandler.checkUsername(req.body.username);
        // обработка ошибок проверки имени пользователя 
        checkNameQuery.on('end', function () {
            if (isValidName != true) {
                res.status(404).send('wrong username');
            }
        })

        checkNameQuery.on('result', function (rows) {

            isValidName = true;

            if (isValidPass && isValidName) {

                req.session.isLoggedIn = true;
                req.session.userName = req.body.username;

                sessionStore.set(req.sessionID, req.session, function (err) {
                    if (err) {
                        console.log(err)
                        return;
                    } else {
                        console.log('session saved!');
                        res.send('user found')
                    }
                })
            }
        })
    });
    // обработка ошибок проверки пароля 
    checkPassQuery.on('end', function () {
        if (isValidPass != true) {
            res.status(404).send('wrong password'); 
        }
    })


}); 


app.listen(3000, function () {
    console.log('app running on port 3000');
})