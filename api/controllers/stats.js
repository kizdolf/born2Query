'use strict';

var Teen 		= require('./../models/teenUser');
var Ope			= require('./../models/ope.js');

exports.all = function(req, res){
	Teen.find({}, function(err, users){
		if(err)
			res.send(err);
		Ope.find({}, function(err, opes){
			if (err)
				res.send(err);
			res.json({message: 'all stats (like a dump)', users: users, opes: opes});
		});
	});
};

exports.one = function(req, res){
	Teen.findOne({no_client: req.params.no_client}, function(err, user){
		if(err)
			res.send(err);
		if (!!user){
			if (!user.compareToken(req.params.token)){
				res.json({err: 'Wrong token'});
			}
			user.getOPs().then(function(ops){
				res.json({message: 'User founded', user: user, ops : ops});
			});
		}else{
			res.json({err: 'User do not exist'});
		}
	});
};