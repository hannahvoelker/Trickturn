var express = require('express');
var path    = require('path');
var favicon = require('serve-favicon');
var logger  = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

var mongoUri = 'mongodb://localhost:27017';
var MongoClient = require('mongodb').MongoClient, format = require('util').format;
var db = MongoClient.connect(mongoUri, function(err, databaseConnection) {
    if (err) throw err;
    db = databaseConnection;
    db.dropDatabase();
    db.createCollection('data', null);
});

// Updates db with a new score, inserting a new instance if email is not found.
// Returns the top 10 instances of high scores.
// Request parameters: email, username and score
// Response type: an array of results stored under "data"
app.post('/submit', function(request, response) {
    var toInsert = {
        "email":    request.body.email,
        "username": request.body.username,
        "score":    request.body.score
    }

    db.collection('data', function(er, collection) {
        collection.update({ email: request.body.email }, toInsert, {upsert : true}, function(err, results) {
        });
        collection.find().sort({ score: -1 }).limit(10).toArray(function(err, results) {
            response.send({"data": results});
        });
    });
    

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
