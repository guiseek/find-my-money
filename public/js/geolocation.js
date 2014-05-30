address = {
	set: function(address) {
		localStorage.setItem('address', JSON.stringify(address));
	},
	get: function() {
		return JSON.parse(localStorage.getItem('address'));
	},
};
if (navigator.geolocation) {
	if (window.localStorage) {
		if (address.get()) {
			console.log(address.get());
		}
		else {
			navigator.geolocation.getCurrentPosition(function success(gp) {
				var googleMapsApi = 'http://maps.googleapis.com/maps/api/geocode/json?latlng=';
				jQuery.get(googleMapsApi + gp.coords.latitude + ',' + gp.coords.longitude + '&sensor=false').
				success
			});
		}
	}
	else {
		console.log('nao suporta localstorage');
	}
	/*
	if (address.get()) {
		console.log('localStorage');
		console.log(address.get());
		$('#result').html(JSON.stringify(address.get()));
	}
	else {
		console.log('geolocation');
		navigator.geolocation.getCurrentPosition(
			function success(gp) {
				var lat = gp.coords.latitude;
				var lng = gp.coords.longitude;
				jQuery.get('http://maps.googleapis.com/maps/api/geocode/json?latlng='+lat+','+lng+'&sensor=false').success(function(data) {
					address.set(data.results[0].address_components);
					console.log(address.get());
				});
			},
			function error(e) {
				console.log('GeoLocation error ' + e.code + ': ' + e.message);
			}
		);
	}
	*/
}
else {
	console.log('Seu navegador não suporta GeoLocation');
}