'use strict';

var	mongoose				= require('mongoose'),
	Q						= require('q'),
	Schema				= mongoose.Schema,
	bcrypt					= require('bcrypt'),
	SALT_WORK_FACTOR	= 10,
	// Token					= require('rand-token'), si token faux, on regénere un token ou pas?
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
	opes : [{
		 type: Schema.Types.ObjectId, ref: 'Ope' 
	}],
	token : {
		type: String, default: ''
	},
	contacts : {
		type: Array,
		default: []
	},
	demandes: [{
		date: Date,
		id:{type: String, index: {unique: true}},
		token: String,
		pending: Boolean,
		accept: Boolean,
		reason: String,
		to : {},
		amount : Number
	}]
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
	Ope.find({_id:{$in: this.opes}}).sort({date: -1}).exec(function(err, alls){
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

UserSchema.methods.compareToken = function(token){
	return (token == this.token);
};

UserSchema.methods.addMoney = function(amount){
	this.money.current += parseInt(amount);
	this.save();
	return true;
};

UserSchema.methods.removeMoney = function(amount){
	if (this.money.current - amount > this.money.authorized){
		this.money.current -= amount;
		this.save();
		return 'ok';
	}else{
		return 'not enough money';
	}
};

module.exports = mongoose.model('Teen', UserSchema); 
