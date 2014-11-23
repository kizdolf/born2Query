'use strict';

angular.module('CA42.controllers', [])

.controller('mainCtrl', ['$scope', 
function($scope){

	$scope.message = 'welcome!';

}])
.controller('loginCtrl', ['$scope', '$http', 
function($scope, $http){

	$scope.message = 'please log in';

	$scope.login  = function(user){
		console.log(user);
		$http.get('/api/login/' + user.no_compte + '/' + user.password)
		.then(function(data){
			console.log(data);
			if(!!data.data.err){
				$scope.message = 'Something bad happen.';
			}else{
				$scope.user = data.data.identity;
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
				$scope.user = data.data.identity;
			}
		});
	};

}]);