'use strict';

angular.module('CA42.controllers', [])

.controller('mainCtrl', ['$scope', 
function($scope){

	$scope.message = 'welcome!';

}])

.controller('loginCtrl', ['$scope', '$http', 
function($scope, $http){


	$scope.message = 'please log in';

	$('#logged').hide();
	$scope.login  = function(user){
		$http.get('/api/login/' + user.no_compte + '/' + user.password)
		.then(function(data){
			console.log('user log in :');
			console.log(data.data);
			if(!!data.data.err){
				$scope.message = 'Something bad happen.';
			}else{
				$('#logged').show();
				$('#notLogged').hide();
				$scope.user = data.data.user;
				$scope.statUser();
				$scope.message = 'Welcome ' + data.data.user.identity.firstName;
			}
		});
	};

	$scope.statUser = function(){
		$http.get('/api/stats/' + $scope.user.no_client + '/' + $scope.user.token)
		.then(function(data){
			$scope.stats = data.data;
		});
	};

	$scope.newOpe = function(ope){
		$http.post('/api/ope/' + $scope.user.no_client + '/' + $scope.user.token, ope)
		.then(function(data){
			console.log(data.data);
			$scope.statUser();
		});
	};

	$scope.newContact = function(contact){
		$http.post('/api/contacts/' + $scope.user.no_client + '/' + $scope.user.token, contact)
		.then(function(){
			$scope.statUser();
		});
	};

	$scope.deleteOpe = function(ope){
		$http.delete('/api/ope/' + $scope.user.no_client + '/' + ope._id + '/' + $scope.user.token)
		.then(function(){
			$scope.statUser();
		});
	};

	$scope.logout = function(){
		$http.get('/api/logout/' + $scope.user.no_client + '/' + $scope.user.token)
		.then(function(data){
			console.log(data.data);
			$('#notLogged').show();
			$('#logged').hide();
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

}]);