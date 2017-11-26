var mongoose = require("mongoose");
var bcrypt = require("bcryptjs");
var Schema = mongoose.Schema;


var UserSchema = Schema({
	username:{
		type: String,
		index:true,
		required:true,
		unique:true
	},
	password:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true,
		unique:true
	},
	name:{
		type:String,
		required:true
	}
})

var User = module.exports = mongoose.model("User",UserSchema);

module.exports.createUser = function(newUser,callback){
	bcrypt.genSalt(10,function(err,salt){
		bcrypt.hash(newUser.password, salt, function(err,hash){
			newUser.password = hash;
			newUser.save(callback);
		});
	});
}


module.exports.getUserByUsername= function(username,callback){
	var query={ username:username};
	User.findOne(query,callback);
}




module.exports.getUserById= function(id,callback){
	User.findById(id,callback);
}


module.exports.comparePassword = function(candidatePassword,hash,callback){
	bcrypt.compare(candidatePassword,hash,function(err,isMatch){
		if(err) throw err;
		callback(null,isMatch);
	});
}

module.exports.updateUser = function(id,callback){
	User.findOneAndUpdate(
		{_id:id},
		{$set:{}})
}
