'use strict';

var Teen 		= require('./../models/teenUser'),
	Token		= require('rand-token');

exports.create =  function (req, res){
	var teen = new Teen();
	var infos = req.body;
	teen.identity.firstName = infos.first;
	teen.identity.lastName = infos.last;
	teen.identity.location = infos.location;
	teen.identity.birth = new Date(infos.birth);
	teen.no_client = req.params.no_client;
	teen.password = req.params.mdp;
	teen.token = Token.generate(16);
	teen.save(function(err){
		if(err){
			if (err.code == 11000)
				res.json({ message: 'user ' + req.params.no_client + ' alredy exist!' });
			else
				res.send(err);
		}
		res.json({ user : teen });
	});
};

exports.connect = function(req, res){
	Teen.findOne({no_client: req.params.no_client}, function(err, user){
		if(err)
			res.send(err);
		if(!!user){
			user.comparePassword(req.params.mdp, function(err, isMatch){
				if(err)
					res.send(err);
				if (isMatch){
					user.token = Token.generate(16);
					user.save(function(err){
						if(err)
							res.send(err);
						res.json({ user: user});
					});
				}
				else
					res.json({ err: 'mdp FAIL'});
			});
		}else{
			res.json({ err: 'User do not exist'});
		}
	});
};

exports.logout = function(req, res){
	Teen.findOne({no_client : req.params.no_client}, function(err, user){
		if (err)
			res.send(err);
		if(!!user){
			if (!user.compareToken(req.params.token)){
				res.json({err: 'bad Token'});
			}else{
				user.token = Token.generate(16);
				user.save(function(err){
					if(err)
						res.send(err);
					res.json({message: 'user disconnected'});
				});
			}
		}
		res.json({err: 'user do not exist'});
	});
};
