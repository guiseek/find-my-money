'use strict';

/* Services */

// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', ['ngResource']).
  factory('socket', function ($rootScope) {
    var socket = io.connect();
    return {
      on: function (eventName, callback) {
        socket.on(eventName, function () {  
          var args = arguments;
          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      },
      emit: function (eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;
          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        })
      }
    };
  }).
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