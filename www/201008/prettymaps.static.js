function load_staticmap(){

    	zoomable_places.push([ 45.413479, -73.976608, 45.704788, -73.476418 ]);		// http://woe.spum.org/id/3534 (montreal)
    	zoomable_places.push([ 38.673569, -9.24054, 38.795689, -9.04763 ]);		// http://woe.spum.org/id/12596415 (lisbon, county)

	var svg = pm.svg("svg");
	var parent = document.body.appendChild(svg);

	var iso = pm.image();
	iso.url(tilestache(tile_server + '/isola/{Z}/{X}/{Y}.png'));

	var controls = pm.interact();
	var hash = pm.hash();

	map = pm.map();
	map.container(parent);

	map.center({lat: 19.366349, lon: -103.083425});
	map.zoomRange([2, 10]);
	map.zoom(2);

	map.add(controls);
	map.add(hash);
	map.add(iso);

	map.on('move', function (e){

		var z = map.zoom();

		var r = map.zoomRange();
		var u = r[1];

		var center = map.center();
		var lat = center.lat;
		var lon = center.lon;

		var canhaszoom = false;
		
		if (is_zoomable(lat, lon)){

			if (u != 15){
				map.zoomRange([2, 15]);
			}

			canhaszoom = true;
		}
	
		else {

			if (u != 10){
				map.zoomRange([2, 10]);
			}
		}

		// Update zoom controls

		z = map.zoom();		
		r = map.zoomRange();

		var near = document.getElementById('near');
		var far = document.getElementById('far');

		var far_display = (z <= r[0]) ? 'none' : 'block';
		var near_display = (z >= r[1]) ? 'none' : 'block';			

		near.style.display = near_display;
		far.style.display = far_display;

	});

}

function toggle_static_notice(bool){
    var s = document.getElementById('static');
    s.style.display = (bool) ? 'block' : 'none';
}

function goto_prettymaps(){

    var c = map.center();
    var z = map.zoom();
	
    var url = "/201008/#" + z + "/" + c.lat + "/" + c.lon;
    location.href = url;
}
