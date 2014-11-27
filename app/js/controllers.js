'use strict';

angular.module('CA42.controllers', [])

.controller('mainCtrl', ['$scope', '$http', 'localStorageService', '$location',
function($scope, $http, localStorageService, $location){

	if (localStorageService.get('token') !== null)
		$location.path('me');

	$scope.logout = function(){
		var token = localStorageService.get('token');
		var no_client = localStorageService.get('no_client');
		$http.get('/api/logout/' + no_client + '/' + token).then(function(){
			$location.path('app');
			localStorageService.clearAll();
		});
	};

}])

.controller('loginCtrl', ['$scope', '$http', 'localStorageService', '$location',
function($scope, $http, localStorageService, $location){

	$scope.message = 'please log in';
	localStorageService.clearAll();

	if (localStorageService.get('token') !== null)
		$location.path('me');

	$scope.login  = function(user){
		$http.get('/api/login/' + user.no_compte + '/' + user.password)
		.then(function(data){
			if(!!data.data.err){
				$scope.message = 'Something bad happen.';
			}else{
				localStorageService.set('token', data.data.user.token);
				localStorageService.set('no_client', data.data.user.no_client);
				localStorageService.set('firstname', data.data.user.identity.firstName);
				$location.path('me');
			}
		});
	};

}])

.controller('logonCtrl', ['$scope', '$http', 
function($scope, $http){

	$scope.message = 'please log in';

	$scope.newUser  = function(user){
		$http.post('/api/login/' + user.noClient + '/' + user.mdp, user)
		.then(function(data){
			console.log(data);
			if(!!data.data.err){
				$scope.message = 'Something bad happen.';
			}else{
				$scope.message = 'Welcome ' + data.data.user.identity.firstName;
			}
		});
	};

}])

.controller('userCtrl', ['$scope', '$http', 'localStorageService', '$timeout',
function($scope, $http, localStorageService, $timeout){

	$scope.message = 'Welcome !!';
	$scope.notif = '';
	var token = localStorageService.get('token');
	var no_client = localStorageService.get('no_client');


	$scope.statUser = function(){
		$http.get('/api/stats/' + no_client + '/' + token)
		.then(function(data){
			$scope.stats = data.data;
			$scope.InOut();
		}).then(function(){
			$scope.credit.nb = $scope.credit.opes.length;
			$scope.credit.amount = $.sumOpes($scope.credit.opes);
			$scope.debit.nb = $scope.debit.opes.length;
			$scope.debit.amount = $.sumOpes($scope.debit.opes);
			console.log($scope.debit);
		});
	};
	$scope.statUser();
	

	$scope.newOpe = function(ope){
		$http.post('/api/ope/' + no_client + '/' + token, ope)
		.then(function(data){
			console.log(data.data);
			if(data.data.err){
				popNotif(data.data.err);
			}
			$scope.statUser();
		});
	};

	var popNotif = function(txt){
		$scope.notif=txt;
		$timeout(function(){
			console.log('ici');
			$scope.notif = '';
		}, 3000);
	};

	$scope.newContact = function(contact){
		$http.post('/api/contacts/' + no_client + '/' + token, contact)
		.then(function(){
			$scope.statUser();
		});
	};

	$scope.deleteOpe = function(ope){
		$http.delete('/api/ope/' + no_client + '/' + ope._id + '/' + token)
		.then(function(){
			$scope.statUser();
		});
	};

	$scope.moneyAsking = function(contact){
		$('#asking').show('slow');
		$scope.askTo =  contact;
	};

	$scope.askMoney = function(ask){
		ask.to = $scope.askTo;
		console.log(ask);
		$http.post('/api/ask/' + no_client + '/' + token, ask)
		.then(function(data){
			console.log(data);
			popNotif(data.data.message);
		});
	};

	$scope.InOut = function(){
		var opes = $scope.stats.ops;
		$scope.nbOps = opes.length;
		$scope.credit = {};
		$scope.debit = {};
		$scope.credit.opes = jQuery.grep(opes, function( n ) {
			return ( (n.InOut === 'credit') && (n.sucess === true));
		});
		$scope.debit.opes = jQuery.grep(opes, function( n ) {
			return ( (n.InOut !== 'credit') && (n.sucess === true));
		});
	};

	$.sumOpes = function(opes) {
		var total = 0;
		$.each(opes, function(i, ope) {
			total += ope.amount;
		});
		return total;
	};

}])

.controller('demandCtrl', ['$scope', '$http', '$routeParams',
function($scope, $http, $routeParams){

	$scope.params = $routeParams;
	console.log($scope.params);
	$http.get('/api/ask/'+ $scope.params.id + '/' + $scope.params.token)
	.then(function(data){
		if(!!data.data.err)
			$scope.err = data.data.err;
		$scope.user = data.data.user;
		$scope.demand = data.data.demand;
		console.log(data.data);
	});

	$scope.validate = function(status){
		var ok = {ok: true};
		if (status === 0)
			ok.ok = false;
		$http.put('/api/ask/'+ $scope.params.id + '/' + $scope.params.token, ok)
		.then(function(data){
			$('#btnsVal').hide();
			if(!!data.data.err)
				$scope.err = data.data.err;
			else
				$scope.message = data.data.message;
		});
	};


}]);

