'use strict';

var express		= require('express');

module.exports = (function(){

var	router 				= express.Router(),
	OpeCtrl				= require('./controllers/operations'),
	Login				= require('./controllers/login'),
	Teen				= require('./controllers/teen'),
	Stats				= require('./controllers/stats');

router.use(function(req, res, next) {
	// console.log(req.method + ' on ' + req.url);
	next();
});

router.get('/', function(req, res){
	res.json({message: 'main endpoint of the API'});
});

router.route('/login/:no_client/:mdp')
	.post(Login.create)
	.get(Login.connect);

router.route('/logout/:no_client/:token')
	.get(Login.logout);

router.route('/contacts/:no_client/:token')
	.post(Teen.contacts);

router.route('/stats/all')
	.get(Stats.all);

router.route('/stats/:no_client/:token')
	.get(Stats.one);

router.route('/ope/:no_client/:token')
	.post(OpeCtrl.addOne);

router.route('/ope/:no_client/:id_ope/:token')
	.delete(OpeCtrl.remOne);

router.route('/ask/:no_client/:token')
	.put(Teen.updateAsk)
	.post(Teen.ask)
	.get(Teen.findAsk);
	
	return router;

})();