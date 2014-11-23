'use strict';

var Teen 		= require('./../models/teenUser');

exports.all = function(req, res){
	Teen.find({}, function(err, users){
	if(err)
		res.send(err);
		res.json({message: 'all users', users: users});
	});
};

exports.one = function(req, res){
	Teen.findOne({no_client: req.params.no_client}, function(err, user){
		if(err)
			res.send(err);
		if (!!user){
			user.getOPs().then(function(ops){
				res.json({message: 'there is one user.', user: user, ops : ops});
			});
		}else{
			res.json({message: 'there is no such user.'});
		}
	});
};