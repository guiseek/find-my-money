'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http) {

    $http({
      method: 'GET',
      url: '/api/name'
    }).
    success(function (data, status, headers, config) {
      $scope.name = data.name;
    }).
    error(function (data, status, headers, config) {
      $scope.name = 'Error!';
    });

  }).
  controller('MapController', ['$scope', '$http', 'Bank', function ($scope, $http, Bank) {
    console.log('Map Controller');

    $scope.offcanvas = function() {
    	$('.row-offcanvas').toggleClass('active');
    }

    // Map
		$scope.map = {
			center: {
				latitude: 0,
				longitude: 0
			},
			zoom: 14
		};

		// Banks
		//var banks = Bank.query();
    var url = '/api/banks/';
    $http({
    	method: 'GET',
    	url: url
    }).
    success(function(data) {
    	console.log('SUCESSO', data);
    	$scope.banks = data;
      $scope.map.markers = [];
      data.forEach(function(bank) {
        $scope.map.markers.push(
          {
            id: bank._id,
            latitude: bank.lat,
            longitude: bank.lng,
            showWindow: true,
            title: bank.name
          }
        );
      });
      console.log($scope.map.markers);
    }).
    error(function(data) {
    	console.log('ERRO', data);
    });




		//$scope.map.center.latitude = -23.420999;
		//$scope.map.center.longitude = -51.933056;

		// Functions
		$scope.center = function(center) {
			console.log(center);
			$scope.map.center = center;
		}
    $scope.getLocation = function() {
    	if (navigator.geolocation) {
    		navigator.geolocation.getCurrentPosition(function(gp) {
    			var lat = gp.coords.latitude;
    			var lng = gp.coords.longitude;
    			$scope.latlng = {latitude: lat, longitude: lng};
    		});
    	}
    }
    $scope.getLocation();
    $scope.setLocation = function() {
    	$scope.center($scope.latlng)
    }

  }]).
  controller('BankIndexController', ['$scope', '$http', function ($scope, $http) {
    var url = '/api/banks';

    console.log('Bank Index');

    $http({
      method: 'GET',
      url: url
    }).
    success(function(data){
      console.log('SUCESSO', data);
      $scope.banks = data;
      $scope.alert = {
        type: 'info',
        msg: 'Lista de bancos'
      };
    }).
    error(function(data){
      console.log('ERRO', data);
      $scope.alert = {
        type: 'danger',
        msg: 'Erro ao listar'
      };
    });

  }]).
  controller('BankNewController', ['$scope', '$http', function ($scope, $http) {

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(gp) {
        var lat = gp.coords.latitude;
        var lng = gp.coords.longitude;

        jQuery.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false').success(function(data) {
          var address_components = data.results[0].address_components;
          console.log(address_components);
          var address = {
            address: address_components[1].long_name,
            description: address_components[2].long_name,
            city: address_components[3].long_name,
            estate: address_components[4].long_name,
            country: address_components[5].long_name,
            lat: lat,
            lng: lng
          };
          console.log(address);
          $scope.form = address;
        });
      });
    }

    $scope.alert = {
      type: 'info',
      msg: 'Cadastre um banco'
    };

    $scope.create = function(form){
      var dados = form;
      var url = '/api/banks';

      $http({
        method: 'POST',
        url: url,
        data: dados
      }).
      success(function(data){
        $scope.alert = {
          type: 'success',
          msg: 'Banco cadastrado'
        };
      }).
      error(function(data){
        $scope.alert = {
          type: 'info',
          msg: 'Banco não cadastrado'
        };
      });

    }
  }]).
  controller('BankUpdateController', ['$scope', '$http', '$routeParams', 'Bank', function ($scope, $http, $routeParams, Bank) {

    $scope.alert = {
      type: 'info',
      msg: 'Altere o banco'
    };

    var id = $routeParams.id;
    var url = '/api/banks/' + id;
    
    $scope.form = {};

    /*
    var bank = Bank.get({id: id});
    delete bank._id;
    $scope.form = bank;

    $scope.save = function(form) {
    	var data = form;
    	Bank.update({id: form._id}, data);
    	//Bank.update({id: form._id}, form);
    }
		*/
    $http({
      method: 'GET',
      url: url
    }).
    success(function(data){
      console.log(data);
      delete data._id;

      $scope.form = data;
      $scope.alert = {
        type: 'info',
        msg: 'Altere um banco'
      };
    }).
    error(function(data){
      console.log('ERRO', data);
      $scope.alert = {
        type: 'danger',
        msg: 'Erro ao recuperar banco'
      };
    });

    $scope.save = function(form){
      var dados = form;
      console.log(dados);

      $http({
        method: 'PUT',
        url: url,
        data: dados
      }).
      success(function(data){
        $scope.alert = {
          type: 'success',
          msg: 'Banco alterado'
        };
      }).
      error(function(data){
        $scope.alert = {
          type: 'danger',
          msg: 'Banco não alterado'
        };
      });
    }


    $scope.delete = function(){

      $http({
        method: 'DELETE',
        url: url
      }).
      success(function(data){
        $scope.alert = {
          type: 'success',
          msg: 'Banco apagado'
        };
      }).
      error(function(data){
        $scope.alert = {
          type: 'danger',
          msg: 'Banco não apagado'
        };
      });

    }

  }]).
  controller('MyCtrl1', function ($scope) {
    // write Ctrl here

  }).
  controller('MyCtrl2', function ($scope) {
    // write Ctrl here

  });
