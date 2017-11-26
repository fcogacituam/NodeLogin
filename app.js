var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


//Authentication requires
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var mongo = require("mongodb");
var mongoose = require("mongoose");

var db = mongoose.connection.openUri("mongodb://localhost/loginapp",(err,res)=>{
	if(err){
		return console.log(`Error al conectar a la bdd: ${err}`);
	}
	console.log("Conexión establecida...");
});



var index = require('./routes/index');
var users = require('./routes/users');
var admin = require('./routes/admin');

var app = express();



//middleware for sessions
app.use(session({
	secret:'secret',
	saveUninitialized:true,
	resave:true
}));

//connect flash
app.use(flash());

//global vars
app.use(function(req,res,next){
	res.locals.success_msg = req.flash('success_msg');
	res.locals.error_msg = req.flash("error_msg");
	res.locals.error = req.flash("error");
	res.locals.user = req.user || null;
	next();
})


	
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//Passport init
app.use(passport.initialize());
app.use(passport.session());


//middleware express validator
app.use(expressValidator({
	errorFormatter: function(param,msg,value){
			var namespace = param.split('.')
			, root = namespace.shift()
			, formParam = root;

		while(namespace.length){
			formParam += '[' + namespace.shift() + ']';
		}
		return{
			param: formParam,
			msg: msg,
			value: value
		};
	}
}));






app.use('/', index);
app.use('/users', users);
app.use('/admin',admin);







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
