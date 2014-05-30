$(document).ready(function() {
	function setHeight() {
	  var height = $('.page-container').height();
	  $('.map').height(height);
	  $('#sidebar').height(height);
	}
	setHeight();
	$(window).resize(function() {
	  setHeight();
	});
	$('[data-toggle="offcanvas"]').on('click', function() {
	  $('.row-offcanvas').toggleClass('active');
	});
});
