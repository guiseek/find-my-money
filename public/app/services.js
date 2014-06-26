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
  /*
	factory('Bank', ['$resource', '$q',
  	function($resource, $q) {
    	var banks = $resource('/api/banks/:id', {id: '@id'});
      var factory = {
        query: function() {
          var deferred = $q.defer();
          deferred.resolve(banks);
          return deferred.promise;
        }
      }
      return factory;
  	}
  ]);
  */
  factory('Bank', ['$resource', '$q',
    function($resource, $q) {
      return $resource('/api/banks/:id', {id: '@id'}, {
        query: {method: 'GET', isArray: true},
        get: {method: 'GET'},
        save: {method: 'POST'},
        update: {method: 'PUT'},
        delete: {method: 'DELETE'}
      });
    }
  ]).
  factory('APIMap', ['$resource',
    function($resource) {
      return $resource('http://maps.googleapis.com/maps/api/geocode/json', {latlng: '@latlng'}, {
        query: {method: 'GET'}
      });
    }
  ]);
