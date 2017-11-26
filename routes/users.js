var express = require('express');
var router = express.Router();
var passport=require("passport");
var LocalStrategy=require("passport-local").Strategy;
var User = require("../models/user");
var url = require('url') ;



/* GET users listing. */
router.get('/register', function(req, res, next) {
  res.render('register',{user:req.user});
});

router.get('/login', function(req, res, next) {
  res.render('login',{user:req.user});
});



router.post('/register', function(req, res, next) {
	var nombre = req.body.nombre;
	var username = req.body.username;
	var email = req.body.email;
	var password = req.body.password;
	var password2 = req.body.password2;

	//validations
	req.checkBody('nombre','Name is required').notEmpty();
	req.checkBody('email','Email is required').notEmpty();
	req.checkBody('email','Email is not valid').isEmail();
	req.checkBody('username','Name is required').notEmpty();
	req.checkBody('password','Password is required').notEmpty();
	req.checkBody('password2','Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();
	console.log(errors);
	if(errors){
		res.render('register',{
			errors:errors
		})
	}else{
		var newUser = new User({
			name: nombre,
			email: email,
			username: username,
			password: password
		});
		User.createUser(newUser,function(err,user){
			if(err){
				console.log(err);
			}
			console.log(user);
		})
		var reqUrl = req.headers['referer'];
		console.log(reqUrl);

		// var hostname = req.headers.host;
		// console.log("hostname: "+hostname);
		var pathname = url.parse(reqUrl).pathname;
		// console.log("pathname: "+pathname);


		switch(pathname){
			case '/users/register':
				console.log("se registra usuario desde el switch")
				req.flash('success_msg','You are registered and now you can login');
				res.redirect('/users/login');
				break;
			case '/admin/users/new':
				console.log("se registra usuario desde el switch")
				req.flash('success_msg','user added');
				res.redirect('/admin/users');
				break;
		}

	
	}
});

passport.use(new LocalStrategy(
	function(username,password,done){
		User.getUserByUsername(username,function(err,user){
			if(err) throw err;
			if(!user){
				return done(null,false,{message:'Unknown User'});
			}

			User.comparePassword(password,user.password,function(err,isMatch){
				if(err) throw err;
				if(isMatch){
					console.log(user.username);
					return done(null,user);

				}else{
					return done(null,false,{message:"Invalid password"});
				}
			});
		});
	}));

passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	User.getUserById(id,function(err,user){
		done(err,user);
	})
})


router.post('/login',
	passport.authenticate('local',{successRedirect:'/',failureRedirect:'/users/login',failureFlash:true}),
	function(req,res){
		res.redirect('/');

});

router.get('/logout',function(req,res){
	console.log("usuario deslogueado");
	console.log(req.user);
	req.logout();
	req.flash('success_msg','You are logged out');

	res.redirect('/users/login');
});
module.exports = router;
