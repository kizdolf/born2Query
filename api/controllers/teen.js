'use strict';

var Teen 		= require('./../models/teenUser');

exports.contacts = function(req, res){
	Teen.findOne({no_client: req.params.noClient}, function(err, user){
		if(err)
			res.send(err);
		if(user.compareToken(req.params.token)){
			var contact = {};
			contact.name = req.body.name;
			contact.mail = req.body.mail;
			user.contacts.push(contact);
			user.save(function(err){
				if(err)
					res.send(err);
				res.json({message: 'contact saved.'});
			});
		}
	});
};
