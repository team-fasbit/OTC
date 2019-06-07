

	var msg = window.location.hash.substr(1);
	if (msg) {
		$('.' + msg).show();
		window.location.hash = '';
	}

	$('.showhelp').show();

	$("input[name='buytype']").change(function(){
		var type = $(this).val();

		if (type == 'coin') {
			$('.buyaud').hide();
			$('.buycoin').show();
		} else {
			$('.buyaud').show();
			$('.buycoin').hide();
		}
	});