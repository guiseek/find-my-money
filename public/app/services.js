'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1');

angular.module('myApp.services', ['ngResource']).
	factory('Bank', ['$resource',
  	function($resource){
    	return $resource('/api/banks/:id', {id: '@id'}, {
    		get: {method: 'GET'},
    		save: {method: 'POST'},
    		update: {method: 'PUT'},
      	query: {method:'GET', isArray:true},
      	remove: {method: 'DELETE'}
	    });
  	}
  ]);