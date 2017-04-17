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

app.set('post', 3000);
app.listen(app.get('port'), function() {
    console.log('app.js is running on port', app.get('port'));
});

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.post('/submit', function(request, response) {
    console.log("post submit");
    var origin = request.get('origin'); 
    response.header('Access-Control-Allow-Origin', origin);
    response.header("Access-Control-Allow-Headers", "X-Requested-With");
    response.header('Access-Control-Allow-Headers', 'Content-Type');  
    var User = require('./models/leaders');

    var user = new User({email: request.body.email,
                         username: request.body.username, 
                         highScore: request.body.score});
    console.log("created new user");
    user.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            console.log("saved successfully");
        }
    });
    
    User.find(function(err, results) {
        if (err) {
            console.log(err);
        }
        console.log(results);
        response.send(results);
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
