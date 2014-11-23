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

	$routeProvider.otherwise({
		redirectTo: '/app/'
	});

}]);