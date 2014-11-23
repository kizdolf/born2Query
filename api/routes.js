'use strict';

var express		= require('express');

module.exports = (function(){

var	router 				= express.Router(),
	OpeCtrl				= require('./controllers/operations'),
	Login				= require('./controllers/login'),
	Stats				= require('./controllers/stats');

router.use(function(req, res, next) {
	console.log('Something is happening.');
	next(); // make sure we go to the next routes and don't stop here
});

router.get('/', function(req, res){
	res.json({message: 'main endpoint of the API'});
});

router.route('/login/:noClient/:mdp')
	.post(Login.create)
	.get(Login.connect);

router.route('/stats/all')
	.get(Stats.all);

router.route('/stats/:no_client')
	.get(Stats.one);

router.route('/ope/:no_client')
	.post(OpeCtrl.addOne);

	return router;

})();