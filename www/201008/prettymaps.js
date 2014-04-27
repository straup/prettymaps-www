
function goto_staticmap(){

    var c = map.center();
    var z = map.zoom();
	
    var url = "/201008/static/#" + z + "/" + c.lat + "/" + c.lon;
    location.href = url;
}

function whereami(name, type){
	var w = document.getElementById('whereami');
	w.innerHTML = name;

	if ((debug) && (type)){
            w.innerHTML += '<div class="ima">aka a "' + type + '"</div>';	// escape me
	}

	w.style.display = 'block';
}

function hide_whereami(){
	var w = document.getElementById('whereami');
	w.innerHTML = '';
	w.style.display = 'none';
}

function onload_geojson(e){

	var count = e.features.length;

	if (! count){
		return;
	}

	var z = map.zoom();

	var proj = e.proj;
	var tile = e.tile;
	var g = tile.element;

	for (var i=0; i < count; i++){
		var f = e.features[i];

		// neatural earth

		if (f.data.properties.featurecla){
			name = 'Untitled Urban Area #' + f.data.id;
			f.element.setAttribute('class', 'naturalearth urbanarea');
			f.element.setAttribute("onmouseover", 'whereami("' + name + '");');
			f.element.setAttribute("onmouseout", 'hide_whereami();');
			continue;
		}

		// WOE 

		if (f.data.properties.woe_id){

                    var placetype = 'locality';
			parts = f.data.properties.label.split(', ');
			parts.pop();

			// if (parts[ parts.length - 1] == 'US'){
                        if (parts.length == 4){
                            parts.pop();	// remove 'US'
                            parts.pop();	// remote state
                            placetype = 'neighbourhood';
			}

			name = parts.join(', ');

			f.element.setAttribute('class', 'woe ' + placetype);
			f.element.setAttribute("onmouseover", 'whereami("' + name + '");');	// quote me
			f.element.setAttribute("onmouseout", 'hide_whereami();');
			continue;
		}

		// osm

		var name = f.data.properties.name;
		var type = f.data.properties.highway;

		if ((name == 'null') || (name == null)){
			name = 'Untitled OSM Feature #' + f.data.id;
		}
		       
		f.element.setAttribute('class', 'osm ' + type);
		f.element.setAttribute("onmouseover", 'whereami("' + name + '", "' + type + '");');	// quote me
		f.element.setAttribute("onmouseout", 'hide_whereami();');
	}
}

function toggle_slow_notice(bool){
    var s = document.getElementById('slow');
    s.style.display = (bool) ? 'block' : 'none';
}

function load_prettymaps(){

    	// The studio
	// var lat = 37.764857;
	// var lon = -122.419363;

	var lat = 19.366349;
	var lon = -103.083425;
	var zoom = 2;

	var svg = pm.svg("svg");
	svg.setAttribute('id', 'bucket');

	var parent = document.body.appendChild(svg);

	// Raster layers

	var ground = pm.image();
	ground.url(tilestache(tile_server + '/flurban-ground/{Z}/{X}/{Y}.png'));

	var flurban = pm.image();
	flurban.url(tilestache(tile_server + '/flurban-noground/{Z}/{X}/{Y}.png'));

	var osm = pm.image();
	osm.url(tilestache(tile_server + '/osm/{Z}/{X}/{Y}.png'));

	var urban = pm.image();
	urban.url(tilestache(tile_server + '/urbanareas/{Z}/{X}/{Y}.png'));

	// Data layers

	var ne = pm.geoJson();
	ne.url(tilestache(tile_server + '/urbanareas.json/{Z}/{X}/{Y}.json'));
	ne.clip(false);
	ne.visible(false);
	ne.on('load', onload_geojson);

	var highways = pm.geoJson();
	highways.url(tilestache(tile_server + '/highways.json/{Z}/{X}/{Y}.json'));
	highways.clip(false);
	highways.visible(false);
	highways.on('load', onload_geojson);

	var roads = pm.geoJson();
	roads.url(tilestache(tile_server + '/roads.json/{Z}/{X}/{Y}.json'));
	roads.clip(false);
	roads.visible(false);
	roads.on('load', onload_geojson);

	var people = pm.geoJson();
	people.url(tilestache(tile_server + '/people.json/{Z}/{X}/{Y}.json'));
	people.clip(false);
	people.visible(false);
	people.on('load', onload_geojson);

	var localities = pm.geoJson();
	localities.url(tilestache(tile_server + '/localities.json/{Z}/{X}/{Y}.json'));
	localities.clip(false);
	localities.visible(false);
	localities.on('load', onload_geojson);

	var neighbourhoods = pm.geoJson();
	neighbourhoods.url(tilestache(tile_server + '/neighbourhoods.json/{Z}/{X}/{Y}.json'));
	neighbourhoods.clip(false);
	neighbourhoods.visible(false);
	neighbourhoods.on('load', onload_geojson);

	// Controls

	var controls = pm.interact();
	var hash = pm.hash();

	// The map -- hey look, a global variable!!

	map = pm.map();
	map.container(parent);

	map.center({lat: lat, lon: lon});
	map.zoomRange([2, 15]);
	map.zoom(zoom);

	//

	if (show_tile_monitor){

	    var monitor = document.getElementById('monitor');

	    function tile_monitor(){

		// see this? it's using a patched version of the polymaps
		// Queue.js file Basically all it's doing is adding this
		// bit to the hash that gets returned at the end:
		// count: function(){ return queued.length; },
		// active: function(){ return active; }

		var active = pm.queue.active();
		var queued = pm.queue.count();

		if ((! active) && (! queued)){

		    if (monitor.innerHTML != ''){
			monitor.innerHTML = '';
			monitor.style.display = 'none';
		    }

		    return;
		}

		var html = 'tiles being processed: ' + (active + queued);

		html += '<div id="why"><a href="#" onclick="toggle_slow_notice(1); return false;">why does it take so long?</a></div>';

		monitor.innerHTML = html;
		monitor.style.display = 'block';
	    }

	    setInterval(tile_monitor, 500);
	}

	map.add(ground);
	map.add(flurban);
	map.add(osm);
	map.add(urban);

	map.add(neighbourhoods);
	map.add(highways);
	map.add(roads);
	map.add(people);
	map.add(ne);
	map.add(localities);

	function change(e){

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

		// Layers

		urban.visible(((z >= 2) && (z <= 8)) ? true : false);

		ne.visible(((z >= 4) && (z <= 8)) ? true : false);

		highways.visible(((z >= 9) && (z <= 11)) ? true : false);

		roads.visible((z >= 12) ? true : false);

		people.visible((z >= 13) ? true : false);

		if (canhaszoom){
		    localities.visible(((z >= 8) && (z <= 11)) ? true : false);
		    neighbourhoods.visible(((z == 12) || (z == 13)) ? true : false);
		}

		else{
		    localities.visible(((z >= 8) && (z <= 10)) ? true : false);
		}

        }

	map.on('move', change);

	map.add(controls);
	map.add(hash);

	var touch = pm.touch();
	map.add(touch);
}
