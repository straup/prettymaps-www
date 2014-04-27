var debug = false;
var show_tile_monitor = true;

var pm = org.polymaps;
var map = null;

var tile_server = '/201008/tiles';
var tile_scheme = 'zxy';

var zoomable_places = [
     [ 36.893089, -123.533684, 38.8643, -121.208199 ], 		// http://woe.spum.org/id/23511738 (sfba)
     [ 51.261318, -0.563, 51.686031, 0.28036 ],			// http://woe.spum.org/id/44418 (london)
     [ 40.495682, -74.255653, 40.917622, -73.689484 ],		// http://woe.spum.org/id/2459115 (nyc)
     [ 32.800701, -118.944817, 34.823299, -117.646187 ],	// http://woe.spum.org/id/12587688 (la county)

     [ 48.658291, 2.08679, 49.04694, 2.63791 ],			// http://woe.spum.org/id/615702 (paris)
     
     [ 45.402161, -73.999939, 45.704788, -73.476097 ], 		// http://woe.spum.org/id/29375198 (montreal, county)
     [ 38.713249, -9.2483, 38.818378, -9.10876 ],		// http://woe.spum.org/id/742676 (lisbon)

     [ 53.571571, -0.48939, 53.93882, 0.14897 ],		// http://woe.spum.org/id/25211 (hull, uk)

     [ 29.39027, -95.893944, 30.236691, -94.943367 ],		// http://woe.spum.org/id/2424766 (houston, tx)
     [ 30.060181, -97.935928, 30.519581, -97.5634 ],		// http://woe.spum.org/id/2357536 (austin)
     [ 32.545391, -97.038422, 32.989849, -96.516907 ],		// http://woe.spum.org/id/12590063 (dallas county)

     [ 42.031712, -83.55191, 42.451019, -82.869904 ],		// http://woe.spum.org/id/12588795 (wayne county, aka detroit)

     [ -34.18961, 150.517166, -33.57814, 151.342575 ],		// http://woe.spum.org/id/1105779 (sydney)
     [ -35.22105, 138.465378, -34.650799, 138.763474 ],		// http://woe.spum.org/id/1099805 (adelaide)

     [ 41.4697, -88.263779, 42.154339, -87.52449 ],		// http://woe.spum.org/id/12588093 (cook county, aka chicago)

     [ -36.957574, 174.645538, -36.792790, 174.917450 ]		// auckland
];
