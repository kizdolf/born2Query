'use strict';

var Ope		= require('./../models/ope');
var Teen	= require('./../models/teenUser');

exports.addOne =  function(req, res){
	var user;
	user = Teen.findOne({no_client : req.params.no_client}, function(err, user){
		if(!user){
			res.json({err: 'User do not exist'});
		}else{
			var ope = new Ope();
			var kwarg = req.body;
			ope.amount = parseFloat(kwarg.amount);
			ope.type = kwarg.type;
			ope.InOut = kwarg.InOut;
			ope.sucess = true;
			ope.date = new Date();
			switch(ope.InOut){
				case 'credit':
					if (!user.addMoney(ope.amount)){
						ope.sucess = false;
						res.json({err: 'Failure saving operation'});
					}
				break;
				case 'debit':
					var rem = user.removeMoney(ope.amount);
					if (rem !== 'ok'){
						ope.sucess = false;
						res.json({err: rem});
					}
					break;
				default:
					res.json({err: 'Wrong type of operation (credit or debit)'});
					ope.sucess = false;
			}
			ope.save(function(err){
				if(err)
					res.send(err);
				user.opes.push(ope._id);
				user.save(function(err){
					if(err)
						res.send(err);
					res.json({message: 'Operation saved'});
				});
			});
		}
	});
};


exports.remOne = function(req, res){
	Teen.findOne({no_client : req.params.no_client}, function(err, user){
		if(err)
			res.send(err);
		if(!user){
			res.json({err: 'User do not exist'});
		}else{
			if (user.compareToken(req.params.token)){
				var index = user.opes.indexOf(req.params.id_ope);
				if(index > -1){
					user.opes.splice(index, 1);
					user.save(function(err){
						if(err)
							res.send(err);
						res.json({message: 'Operation supressed'});
					});
				}else{
					res.json({err: 'Operation do not exist'});
				}
			}else{
				res.json({err: 'Wrong token'});
			}
		}
	});

};
