var tile_server = 'http://prettymaps.stamen.com/201008/tiles';

var ground_map;	// hey look, a global!

function controls(enable_keyboard){

    var interact = {};
    var drag = org.polymaps.drag();
    var wheel = org.polymaps.wheel();
    var dblclick = org.polymaps.dblclick();
    var arrow = org.polymaps.arrow();

  interact.map = function(x) {
    drag.map(x);
    wheel.map(x);
    dblclick.map(x);

    if (enable_keyboard){
    	arrow.map(x);
    }

    return interact;
  };

  return interact;
}

function gotomap(){
	var c = ground_map.center();
	var z = ground_map.zoom();

	var hash = '#' + z + '/' + c['lat'].toFixed(6) + '/' + c['lon'].toFixed(6);
      	location.href = '/201008/' + hash;
}

function display_zoom(i){
    var zl = document.getElementById('zoomlevel');
    zl.innerHTML = i;	

    var zi = document.getElementById('zoomin');
    var zo = document.getElementById('zoomout');
    var zor = document.getElementById('zoomor');

    zi.style.display = (i == 8) ? 'none' : 'inline';    	
    zo.style.display = (i == 2) ? 'none' : 'inline';    	

    zor.style.display = ((i == 2) || (i == 8)) ? 'none' : 'inline';    	
}

function tilestache(template) {

    function pad(s, n, c) {
	var m = n - s.length;
	return (m < 1) ? s : new Array(m + 1).join(c) + s;
    }

    function format(i) {
	var s = pad(String(i), 6, "0");
	return s.substr(0, 3) + "/" + s.substr(3);
    }

    return function(c) {
	var max = 1 << c.zoom, column = c.column % max; // TODO assumes 256x256
	if (column < 0) column += max;
	return template.replace(/{(.)}/g, function(s, v) {
		switch (v) {
		case "Z": return c.zoom;
		case "X": return format(column);
		case "Y": return format(c.row);
		}
		return v;
	    });
    };
}

function load_prettymaps(){

        // Florida

        var lat = 27.938150;
	var lon = -84.027503;
	var zoom = 3;

	var pm = org.polymaps;

	//

	var ignore = {
            'ground': false,
            'urban': false,
            'flurban': false,
            'osm': false,
	};

	var ground_controls = controls(true);

	var ground_container = document.body.appendChild(pm.svg("svg"));
	ground_container.setAttribute('id', 'ground');

	var ground_layer = pm.image();
	ground_layer.url(tilestache(tile_server + '/flurban-ground/{Z}/{X}/{Y}.png'));       

	ground_map = pm.map();	// hey look, a global!
	ground_map.container(ground_container);

	ground_map.center({lat: lat, lon: lon});
	ground_map.zoomRange([2, 8]);
	ground_map.zoom(zoom);

	ground_map.add(ground_layer);
	ground_map.add(ground_controls);

	//

	var flurban_controls = controls();

	var flurban_container = document.body.appendChild(pm.svg("svg"));
	flurban_container.setAttribute('id', 'flurban');

	var flurban_layer = pm.image();
	flurban_layer.url(tilestache(tile_server + '/flurban-noground/{Z}/{X}/{Y}.png'));       

	var flurban_map = pm.map();
	flurban_map.container(flurban_container);

	flurban_map.center({lat: lat, lon: lon});
	flurban_map.zoomRange([2, 8]);
	flurban_map.zoom(zoom);

	flurban_map.add(flurban_layer);
	flurban_map.add(flurban_controls);

	//

	var osm_controls = controls();

	var osm_container = document.body.appendChild(pm.svg("svg"));
	osm_container.setAttribute('id', 'osm');

	var osm_layer = pm.image();
	osm_layer.url(tilestache(tile_server + '/osm/{Z}/{X}/{Y}.png'));       

	var osm_map = pm.map();
	osm_map.container(osm_container);

	osm_map.center({lat: lat, lon: lon});
	osm_map.zoomRange([2, 8]);
	osm_map.zoom(zoom);

	osm_map.add(osm_layer);
	osm_map.add(osm_controls);

	//

	var urban_controls = controls();

	var urban_container = document.body.appendChild(pm.svg("svg"));
	urban_container.setAttribute('id', 'urban');

	var urban_layer = pm.image();
	urban_layer.url(tilestache(tile_server + '/urbanareas/{Z}/{X}/{Y}.png'));       

	var urban_map = pm.map();
	urban_map.container(urban_container);

	urban_map.center({lat: lat, lon: lon});
	urban_map.zoomRange([2, 8]);
	urban_map.zoom(zoom);

	urban_map.add(urban_layer);
	urban_map.add(urban_controls);

	//

	flurban_map.on('move', function(e){

		if (ignore['flurban']){
                    return;
		}

		ignore['ground'] = true;
		ignore['osm'] = true;
		ignore['urban'] = true;

		var c = flurban_map.center();
		var z = flurban_map.zoom();

		ground_map.center(c);
		ground_map.zoom(z);

		urban_map.center(c);
		urban_map.zoom(z);

		osm_map.center(c);
		osm_map.zoom(z);

		ignore['ground'] = false;
		ignore['osm'] = false;
		ignore['urban'] = false;

		display_zoom(z);
        });

	ground_map.on('move', function(e){

		if (ignore['ground']){
                    return;
		}

		ignore['flurban'] = true;
		ignore['osm'] = true;
		ignore['urban'] = true;

		var c = ground_map.center();
		var z = ground_map.zoom();

		flurban_map.center(c);
		flurban_map.zoom(z);

		urban_map.center(c);
		urban_map.zoom(z);

		osm_map.center(c);
		osm_map.zoom(z);

		ignore['flurban'] = false;
		ignore['osm'] = false;
		ignore['urban'] = false;

		display_zoom(z);
        });

	osm_map.on('move', function(e){

		if (ignore['osm']){
                    return;
		}

		ignore['flurban'] = true;
		ignore['ground'] = true;
		ignore['urban'] = true;

		var c = osm_map.center();
		var z = osm_map.zoom();

		flurban_map.center(c);
		flurban_map.zoom(z);

		ground_map.center(c);
		ground_map.zoom(z);

		urban_map.center(c);
		urban_map.zoom(z);

		ignore['flurban'] = false;
		ignore['ground'] = false;
		ignore['urban'] = false;

		display_zoom(z);
        });

	urban_map.on('move', function(e){

		if (ignore['urban']){
                    return;
		}

		ignore['flurban'] = true;
		ignore['ground'] = true;
		ignore['osm'] = true;

		var c = urban_map.center();
		var z = urban_map.zoom();

		flurban_map.center(c);
		flurban_map.zoom(z);

		ground_map.center(c);
		ground_map.zoom(z);

		osm_map.center(c);
		osm_map.zoom(z);

		ignore['flurban'] = false;
		ignore['ground'] = false;
		ignore['osm'] = false;

		display_zoom(z);
        });

}