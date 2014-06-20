'use strict';

/* Controllers */

angular.module('myApp.controllers', []).
  controller('AppCtrl', function ($scope, $http, $location) {

    $scope.active = function(route) {
      return route === $location.path();
    }

    $scope.geolocation = function(success, error) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          function(position) {
            success(position);
          },
          function(e) {
            var message;
            switch(e.code) {
              case 1: message = 'Permissão negada'; break;
              case 2: message = 'Posição indisponível'; break;
              case 3: message = 'Tempo expirado'; break;
              default: message = 'Erro desconhecido';
            }
            error(message);
          }
        );
      }
      else {
        error('Não disponível');
      }
    }
    $scope.geolocation(
      function(position){
        $scope.glPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      },
      function(message){
        $scope.glError = message;
      }
    );

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
  controller('MapController', ['$scope', '$http', '$location', 'Bank', 'socket', 
    function ($scope, $http, $location, Bank, socket) {

    console.log('Map Controller');

    $scope.formBanks = [
      {name: 'Banco do Brasil'},
      {name: 'Itaú'},
      {name: 'Bradesco'},
      {name: 'Santander'},
      {name: 'Safra'}
    ];

    angular.extend($scope, {
      map: {
        center: {
          latitude: 0,
          longitude: 0
        },
        zoom: 16,
        clickedMarker: {},
        events: {
          click: function (mapModel, eventName, originalEventArgs) {
            if ($scope.glError) {
              $('#glError').modal('show');
            }
            else {
              var e = originalEventArgs[0];
              var marker = {
                latitude: e.latLng.lat(),
                longitude: e.latLng.lng()
              }
              $scope.map.clickedMarker = marker;
              $scope.$apply();
              $('#myModal').modal('show');
              $('#myModal').on('hidden.bs.modal', function (e) {
                $scope.map.clickedMarker = null;
                $scope.$apply();
              });
            }
          }
        }
      }
    });

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
            icon: '/icon/bb.png',
            address: bank.address,
            cashMachine: bank.cashMachine,
            coords: {
              latitude: bank.lat,
              longitude: bank.lng
            },
          }
        );
      });
    }).
    error(function(data) {
    	console.log('ERRO', data);
    });

    google.maps.visualRefresh = true;
    var onMarkerClicked = function (marker) {
      marker.showWindow = true;
      $scope.$apply();
    };

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
          $scope.center({latitude: lat, longitude: lng});
    		});
    	}
    }
    $scope.getLocation();
    $scope.setLocation = function() {
    	$scope.center($scope.latlng)
    }

    // events
    socket.on('post bank', function (data) {
      console.log(data);
      $scope.banks.push(data.bank);
    });
    socket.on('update bank', function (data) {
      console.log(data);
    });
    socket.on('delete bank', function (data) {
      console.log(data);
      var index = $scope.banks.indexOf(data.bank);
      $scope.banks.splice(index,1);
    });

  }]).
  controller('BankIndexController', ['$scope', '$http', 'socket', function ($scope, $http, socket) {
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
    socket.on('delete bank', function (data) {
      console.log(data.bank);
    });

    $scope.delete = function(bank){
      $http({
        method: 'DELETE',
        url: url + '/' + bank._id
      }).
      success(function(data){
        //console.log(data);
        socket.emit('delete bank', {
          bank: 'asd'
        });
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
        socket.emit('post bank', {
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
  controller('BankUpdateController', ['$scope', '$http', '$routeParams', 'Bank', 'socket', function ($scope, $http, $routeParams, Bank, socket) {

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
        console.log(data);
        socket.emit('update bank', {
          bank: data
        });
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
        console.log(data);
        socket.emit('delete bank', {
          bank: data
        });
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
