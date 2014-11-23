'use strict';

var Ope		= require('./../models/ope');
var Teen	= require('./../models/teenUser');

exports.addOne =  function(req, res){
	var user;
	user = Teen.findOne({no_client : req.params.no_client}, function(err, user){
		if(!user){
			res.json({message: 'there is no such user.'});
		}else{
			var ope = new Ope();
			var kwarg = req.body;
			console.log(kwarg);
			ope.amount = parseInt(kwarg.amount);
			ope.type = kwarg.type;
			ope.InOut = kwarg.InOut;
			ope.save(function(err){
				if(err)
					res.send(err);
				user.opes.push(ope._id);
				user.save(function(err){
					if(err)
						res.send(err);
					res.json({message: 'operation ajoutée avec succée'});
				});
			});
		}
	});
};
