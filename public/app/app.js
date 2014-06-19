'use strict';

// Declare app level module which depends on filters, and services

angular.module('myApp', [
  'myApp.controllers',
  'myApp.filters',
  'myApp.services',
  'myApp.directives',
  'google-maps',
  'btford.socket-io'
]).
config(function ($routeProvider, $locationProvider) {
  $routeProvider.
    when('/banks', {
      templateUrl: '/expose/banks/index',
      controller: 'BankIndexController'
    }).
    when('/banks/new', {
      templateUrl: '/expose/banks/new',
      controller: 'BankNewController'
    }).
    when('/banks/:id', {
      templateUrl: '/expose/banks/edit',
      controller: 'BankUpdateController'
    }).
    when('/map', {
      templateUrl: '/partials/map',
      controller: 'MapController'
    }).
    when('/map/:id', {
      templateUrl: '/partials/map',
      controller: 'MapController'
    }).
    when('/view1', {
      templateUrl: 'partials/partial1',
      controller: 'MyCtrl1'
    }).
    when('/view2', {
      templateUrl: 'partials/partial2',
      controller: 'MyCtrl2'
    }).
    otherwise({
      redirectTo: '/map'
    });

  $locationProvider.html5Mode(true);
});
