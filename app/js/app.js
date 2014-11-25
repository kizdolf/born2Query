'use strict';

var CA42 = angular.module('CA42', 
	['CA42.controllers', 'CA42.routes', 'LocalStorageModule']); 

CA42.config(function (localStorageServiceProvider) {
  localStorageServiceProvider
    .setPrefix('CA42')
    .setStorageType('sessionStorage')
    .setNotify(true, true);
});
