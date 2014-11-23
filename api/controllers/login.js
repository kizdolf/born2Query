'use strict';

var Teen 		= require('./../models/teenUser');

exports.create =  function (req, res){
	var teen = new Teen();
	var infos = req.body;
	teen.identity.firstName = infos.first;
	teen.identity.lastName = infos.last;
	teen.identity.location = infos.location;
	teen.identity.birth = new Date(infos.birth);
	console.log(teen.identity.birth);
	teen.no_client = req.params.noClient;
	teen.password = req.params.mdp;
	teen.save(function(err){
		if(err){
			if (err.code == 11000)
				res.json({ message: 'user ' + req.params.noClient + ' alredy exist!' });
			else
				res.send(err);
		}
		res.json({ user : teen });
	});
};

exports.connect = function(req, res){
	Teen.findOne({no_client: req.params.noClient}, function(err, user){
		if(err)
			res.send(err);
		if(!!user){
			user.comparePassword(req.params.mdp, function(err, isMatch){
				if(err)
					res.send(err);
				if (isMatch)
					res.json({ user: user});
				else
					res.json({ err: 'mdp FAIL'});
			});
		}else{
			res.json({ err: 'User do not exist'});
		}
	});
};
