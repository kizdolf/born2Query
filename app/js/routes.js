'use strict';

angular.module('CA42.routes', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){

	$routeProvider.when('/app', {
		templateUrl: 'view/main.html',
		controller : 'mainCtrl'
	});

	$routeProvider.when('/login', {
		templateUrl: 'view/login.html',
		controller : 'loginCtrl'
	});

	$routeProvider.when('/logon', {
		templateUrl: 'view/logon.html',
		controller : 'logonCtrl'
	});

	$routeProvider.when('/uniqueDemand', {
		templateUrl: 'view/demand.html',
		controller: 'demandCtrl'
	});

	$routeProvider.when('/me', {
		templateUrl: 'view/me.html',
		controller: 'userCtrl'
	});


	$routeProvider.when('/doc', {
		templateUrl: 'view/docApi.html'
		// controller: 'userCtrl'
	});

	$routeProvider.otherwise({
		redirectTo: '/app/'
	});

}]);