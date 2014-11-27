'use strict';

var Teen 		= require('./../models/teenUser'),
	shortId 		= require('shortid'),
	Ope		= require('./../models/ope'),
	nodemailer = require('nodemailer'),
	Token		= require('rand-token'),
	_ 			= require('lodash');

var transporter = nodemailer.createTransport({
	service: 'Gmail',
	auth: {
		user: 'buretjules@gmail.com',
		pass: 'kizdolf65'
	}
});

exports.contacts = function(req, res){
	Teen.findOne({no_client: req.params.no_client}, function(err, user){
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

exports.ask = function(req, res){
	Teen.findOne({no_client: req.params.no_client}, function(err, user){
		if(err){
			res.send(err);
		}
		if(user.compareToken(req.params.token)){
			//Verif contact existe.
			var index = _.findIndex(user.contacts, req.body.to);
			if(index == -1){
				res.json({err: 'contact do not exist.'});
			}else{
				//on récupère la demande
				var demande		= req.body;
				demande.date		= new Date(demande.date); 
				demande.id			= shortId.generate();
				demande.token		= Token.generate(16);
				demande.pending	= true;
				demande.accept	= false;
				user.demandes.push(demande);
				//on update l'user.
				user.save(function(err){
					if(err)
						res.send(err);
					//mainteant on génére et envoie le mail. 
					var fullUrl = req.protocol + '://' + req.get('host') + '/app/#/uniqueDemand?id='+ demande.id + '&token=' + demande.token;
					var link = {
						html : '<a href="' + fullUrl+ '">demande Ca42</a>',
						plain: fullUrl
					};
					var mailOptions = {
						from: 'Born2Query CA42   <b2Query@ITschool.fr>', 
						to: demande.to.mail,
						subject: 'CA42, demande en attente de' + user.identity.firstName + ' ' + user.identity.lastName, 
						text: 'Bonjour , \n '+ user.identity.firstName + ' ' + user.identity.lastName + ' a une demande pour vous\nDemande : ' + demande.reason + ' \n Avec un montant de ' + demande.amount + '\n Veuillez suivre sur ce lien pour répondre : ' + link.plain + ' \n Merci. Ca42', 
						html: 'Bonjour , <br><b>' + user.identity.firstName  + ' ' + user.identity.lastName + '</b> a une demande pour vous<br>Demande : ' + demande.reason + ' <br> Avec un montant de ' + demande.amount + '<br> Veuillez cliquez sur ce lien pour répondre : ' + link.html + ' <br> Merci. Ca42', 
					};
					transporter.sendMail(mailOptions, function(error){
						if(error){
							res.json({err: 'mail not sent', error : error});
						}else{
							res.json({message: 'mail sent'});
						}//fin else
					}); //fin sendmail
				});//fin user save
			}//fin else
		}else{
			res.json({err: 'wrong token'});
		}
	});
};

exports.findAsk = function(req, res){
	var idDemand = req.params.no_client;
	Teen.findOne({'demandes.id': idDemand}, function(err, user){
		if(err){
			res.send(err);
		}
		var curDate = new Date();
		var index = _.findIndex(user.demandes, {id: idDemand});
		if (index == -1){
			res.json({err: 'demand do not exist'});
		}else{
			var demande = user.demandes[index];
			if (demande.token != req.params.token){
				res.json({err: 'bad token'});
			}else if(demande.pending === false){
				res.json({err: 'operation already answered'});
			}else if (curDate > demande.date){
				res.json({err: 'too late', user: user, demand: demande});
			}else{
				res.json({message: 'demand ok', user: user, demand: demande});				
			}
		}
	});
};

exports.updateAsk = function (req, res){
	var idDemand = req.params.no_client;
	//On trouve l'utilisateur qui contient cette demande.
	Teen.findOne({'demandes.id': idDemand}, function(err, user){
		if(err){
			res.send(err);
		}
		var index = _.findIndex(user.demandes, {id: idDemand});
		var curDate = new Date();
		//on verifie que la demande n'est pas invalide
		if (user.demandes[index].token != req.params.token){
			res.json({err: 'bad token'});
		}else if(user.demandes[index].pending === false){
			res.json({err: 'operation already answered'});
		}else if (curDate > user.demandes[index].date){
			res.json({err: 'too late', user: user, demand: user.demandes[index]});
		}else{
			//On update la demande.
			var message;
			user.demandes[index].pending = false;
			user.demandes[index].token = Token.generate(16);
			if(req.body.ok === true){
				user.demandes[index].accept = true;
				//on ajoute des sous (owwiii)
				user.money.current += parseFloat(user.demandes[index].amount);
				message = 'demande acceptée';
			}else{
				message = 'demande refusée';
			}
			//on met à jour l'utilisateur
			user.save(function(err){
				if(err){
					res.send(err);
				}
				//on créer l'opération. 
				var ope = new Ope();
				ope.amount = parseFloat(user.demandes[index].amount);
				ope.type = 'internet';
				ope.InOut = 'credit';
				//on save l'opération
				ope.save(function(err){
					if (err){
						res.send(err);
					}
					//on rajoute l'id de l'opération à l'utilisateur:
					user.opes.push(ope._id);
					//et on update (again)
					user.save(function(err){
						if (err)
							res.send(err);
						//finallement on est bon :)
						res.json({message: message});
					}); //fin save user
				});//fin save ope
			});//fin save user
		}//fin else
	});//fin findOne user
};
