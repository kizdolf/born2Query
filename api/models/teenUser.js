'use strict';

// app/models/teenUser.js

var	mongoose				= require('mongoose'),
	Q						= require('q'),
	Schema				= mongoose.Schema,
	bcrypt					= require('bcrypt'),
	SALT_WORK_FACTOR	= 10,
	Ope					= require('./ope');
 
var UserSchema = new Schema({
	no_client: { 
		type: String, 
		required: true, 
		index: {unique: true} 
	},
	password: { 
		type: String, 
		required: true 
	},
	identity: {
		firstName : String,
		lastName : String,
		birth : {type: Date, default : new Date()},
		location: String
	},
	money : {
		current : {type: Number, default: 0},
		authorized :{type: Number, default: 0}
	},
	opes : [{ type: Schema.Types.ObjectId, ref: 'Ope' }]
});

UserSchema.virtual('age').get(function (){
	var today=new Date();
	var age=today.getFullYear() - this.identity.birth.getFullYear();
	if(today.getMonth() < this.identity.birth.getMonth() || ( today.getMonth() == this.identity.birth.getMonth() && today.getDate() < this.identity.birth.getDay() ))
		age--;
	return age;
});
 
UserSchema.pre('save', function(next) {
	var user = this;
	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password'))
		return next();
	// generate a salt
	bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
		if (err)
			return next(err);
		// hash the password using our new salt
		bcrypt.hash(user.password, salt, function(err, hash) {
			if (err)
				return next(err);
			// override the cleartext password with the hashed one
			user.password = hash;
			next();
		});
	});
});
 
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
	bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
		if (err)
			return cb(err);
		cb(null, isMatch);
	});
};

UserSchema.methods.getOPs = function(){
	var def = Q.defer();
	Ope.find({_id:{$in: this.opes}}, function(err, alls){
		if(err)
			def.reject(err);
		def.resolve(alls);
	});
	return def.promise;
};


//delete the password from the object, the hash will not be passed to the front(end.)
//Also insert the age into the response.
UserSchema.methods.toJSON = function() {
	var obj = this.toObject({ virtuals: true });
	delete obj.password;
	return obj;
};

module.exports = mongoose.model('Teen', UserSchema); 
