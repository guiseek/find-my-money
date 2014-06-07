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
  controller('MapController', ['$scope', '$http', 'Bank', 'socket', function ($scope, $http, Bank, socket) {
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
			zoom: 16,
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
      $scope.map.windows = [];
      data.forEach(function(bank) {
        $scope.map.markers.push(
          {
            id: bank._id,
            latitude: bank.lat,
            longitude: bank.lng,
            show: true,
            title: bank.name
          }
        );
        $scope.map.windows.push(
          {
            coords: {
              latitude: bank.lat,
              longitude: bank.lng
            },
            show: true
          }
        );
      });
      console.log($scope.map.markers);
    }).
    error(function(data) {
    	console.log('ERRO', data);
    });

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

    // events
    socket.on('send:newBank', function (data) {
      console.log(data);
      $scope.banks.push(data.bank);
    });

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
  controller('BankNewController', ['$scope', '$http', 'socket', function ($scope, $http, socket) {

    if (navigator.geolocation) {
      //$http.defaults.useXdomain = true;
      delete $http.defaults.headers.common['X-Requested-With'];

      navigator.geolocation.getCurrentPosition(function(gp) {
        var lat = gp.coords.latitude;
        var lng = gp.coords.longitude;
        var url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false';

        $http.get(url).
        success(function(data){
          console.log(data.results);
          if (data.status == 'OK') {
            var results = data.results[0];
            var address = {lat: lat, lng: lng};
            [].forEach.call(results.address_components, function(el) {
              switch(el.types[0]) {
                case 'route': address.address = el.long_name; break;
                case 'neighborhood': address.description = el.long_name; break;
                case 'locality': address.city = el.long_name; break;
                case 'administrative_area_level_1': address.estate = el.long_name; break;
                case 'country': address.country = el.long_name; break;
              }
            });
            $scope.form = address;
            console.log(address);
          }
        }).
        error(function(data){
          console.log(data);
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
        socket.emit('send:newBank', {
          bank: data
        });
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
