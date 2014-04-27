function is_zoomable(lat, lon){

	for (var i in zoomable_places){

            var swlat = zoomable_places[i][0];
            var swlon = zoomable_places[i][1];
            var nelat = zoomable_places[i][2];
            var nelon = zoomable_places[i][3];

	    if ((lat > swlat) && (lat < nelat) && (lon > swlon) && (lon < nelon)){
                    return true;
	    }	
	}

	return false;
}

function show_submit(bool){

    var s = document.getElementById('submit');
    s.style.display = (bool) ? 'inline' : 'none';
}

function geocode(){
    var f = document.forms[0];
    var q = f.q.value;

    var feedback = document.getElementById('feedback');
    var instructions = document.getElementById('instructions');

    instructions.style.display = 'none';
    feedback.style.display = 'block';

    var reset_blahblah = function(){
	show_submit(0);
	feedback.style.display = 'none';
	instructions.style.display = 'block';
    };

    q = q.replace(/^\s*/, "").replace(/\s*$/, "");

    if (q == ''){
	feedback.innerHTML = 'you forgot to type a placename!';
	setTimeout(reset_blahblah, 2500);
	return;
    }

    var doThisOnSuccess = function(rsp){

	var lat = parseFloat(rsp.lat);
	var lon = parseFloat(rsp.lon);

	var z = parseInt(rsp['zoom']);
	if (z < 9) { z = z + 3; }
	if (z > 9) { z = 9; }	// check whether can have zoom here

	feedback.innerHTML = 'loading...';

	map.center({'lat': lat, 'lon': lon});
	map.zoom(z);

	setTimeout(reset_blahblah, 2500);
	return;
    };

    var doThisIfNot = function(rsp){
	feedback.innerHTML = 'your query failed with the following error: ' + rsp.message;

	setTimeout(reset_blahblah, 7500);
	return;
    };

    var providers = [
	 'flickr'
    ];

    var args = {
	'flickr_apikey' : 'cd3517b0f24fb371b1d4018fbdf84b59',
	'enable_logging' : true
    };

    var geo = new info.aaronland.geo.Geocoder(args);
    geo.geocode(q, doThisOnSuccess, doThisIfNot);

    feedback.innerHTML = 'searching...';
}

// events

document.onkeydown = function(e){

    // toggle fullscreen mode

    if (e.keyCode != 27){
	return;
    }

    var footer = document.getElementById('footer');
    var display = footer.style.display;

    if (display == ''){
	display = 'none';
    }

    footer.style.display = (display == 'none') ? 'block' : 'none';
}
