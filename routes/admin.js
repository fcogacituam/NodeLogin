var express = require('express');
var router = express.Router();

var users= require('../models/user');



router.get('/',ensureAuthenticated, function(req, res, next) {
  res.render('admin', { title: 'App de Login' ,user:req.user});
});


function ensureAuthenticated(req,res,next){
	if(req.isAuthenticated()){
		return next();
	}else{
		//req.flash('error_msg','You are not logged in');
		res.redirect("/users/login");
	}
}


router.get('/users',function(req,res){
	users.find({}, (err,users)=>{
		if(err) throw err;
		res.render('adminUsers',{user:req.user,users:users});

	});
})


router.get("/users/update/:id",function(req,res){
	users.getUserById(req.params.id,function(err,user){
		if(err) throw err;
		res.render("updateUser",{updatedUser:user});
	})
	
})

router.get("/users/delete/:id",function(req,res){
	users.getUserById(req.params.id,function(err,user){
		if(err){
			console.log(err);
			req.flash('error_msg','Something went wrong');
			res.redirect('/admin/users');
		}
		if(!user){
			console.log(err);
			req.flash('error_msg','the user dont exist');
			res.redirect('/admin/users');
		}

		user.remove(err=>{
			if(err){
				console.log(err);
				req.flash('error_msg','Something went wrong');
				res.redirect('/admin/users');
			}
			req.flash('success_msg','User has been deleted');
			res.redirect('/admin/users');

		})
	})
	
})


router.post("/users/updateuser/:id",function(req,res){

	users.findOneAndUpdate(
	{
		_id:req.params.id
	},
	{
		$set:{
			name:req.body.nombre,
			username:req.body.username,
			email:req.body.email
		}
	},
	{
		upsert:true
	},
	function(err,userModified){
		if(err){
			console.log(err);
			req.flash('error_msg','Something went wrong');
			res.redirect('/admin/users');
		}else{
			req.flash('success_msg','User updated correctly');
			res.redirect('/admin/users');
		}
	}

	)

	
});



router.get('/users/new',function(req,res){
	res.render('newUser');
})
module.exports = router;