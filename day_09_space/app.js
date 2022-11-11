var deck = require('@deck.gl/mapbox');
var layers = require('@deck.gl/layers');
var mesh = require('@deck.gl/mesh-layers');
var obj = require('@loaders.gl/obj');
var maplibregl = require('mapbox-gl');

const map_style = {
  "version": 8,
	"sources": {
    "osm": {
			"type": "raster",
			"tiles": ["https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"],
			"tileSize": 256,
      "attribution": "&copy; OpenStreetMap Contributors",
      "maxzoom": 19
    }
  },
  "layers": [
    {
      "id": "osm",
      "type": "raster",
      "source": "osm"
    }
  ]
};

const map = new maplibregl.Map({
  container: 'map',
  style: map_style,
  center: [-110.3626, 46.8797],
  zoom: 3,
  pitch: 60,
  bearing: 340,
});

data = [
  {
    note: 'Cape Canaveral SFS',
    position: [-80.604333, 28.608389],
    angle: 0,
    color: [249, 219, 189],
    translation: [0, 0, 250000],
  },
  {
    note: 'Vandenberg SFB',
    position: [-120.60124, 34.77204],
    angle: 0,
    color: [252, 161, 125],
    translation: [0, 0, 250000],
  },
  {
    note: 'Pacific Spaceport Complex Alaska',
    position: [-152.337778, 57.435833],
    angle: 0,
    color: [218, 98, 125],
    translation: [0, 0, 250000],
  },
  {
    note: 'Spaceport America',
    position: [-106.969722, 32.990278],
    angle: 0,
    color: [154, 52, 142],
    translation: [0, 0, 250000],
  },
  {
    note: 'Mid-Atlantic Regional Spaceport',
    position: [-75.478056, 37.843333],
    angle: 0,
    color: [13, 6, 40],
    translation: [0, 0, 250000],
  },
  {
    note: 'Corn Ranch',
    position: [-104.758889, 31.423333],
    angle: 0,
    color: [60, 187, 177],
    translation: [0, 0, 250000],
  },
  {
    note: 'SpaceX Boca Chica',
    position: [-97.157, 25.997],
    angle: 0,
    color: [143, 227, 136],
    translation: [0, 0, 250000],
  }
]

const shuttle_layer  = new mesh.SimpleMeshLayer({
    id: 'mesh-layer',
    data,
    mesh: 'shuttle.obj',
    loaders: [obj.OBJLoader],
    getPosition: d => d.position,
    getColor: d => d.color,
    getOrientation: [90, 0, 0],
    getTranslation: d=> d.translation,
    sizeScale: 40000
  }
  );

const deckOverlay = new deck.MapboxOverlay({
  layers: [
    shuttle_layer
  ]
});

map.addControl(deckOverlay);
map.addControl(new maplibregl.NavigationControl());