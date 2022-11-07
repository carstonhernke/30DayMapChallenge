var deck = require('@deck.gl/mapbox');
var layers = require('@deck.gl/layers');
var mapboxgl = require('mapbox-gl');

const map = new mapboxgl.Map({
  container: 'map',
  style: 'https://basemaps.cartocdn.com/gl/positron-nolabels-gl-style/style.json',
  center: [25.02, 60.24],
  zoom: 11,
  bearing: 340,
  pitch: 60
});

function lineColor(feature) {
    switch (feature.route_type) {
        case 1:
            return [0, 102, 51]
        case 3:
            return [0, 0, 255]
        default:
            return [0, 153, 153]
    }
}

const deckOverlay = new deck.MapboxOverlay({
  layers: [
    new layers.GeoJsonLayer({
      id: 'routes',
      data: route_data,
      // Styles
      stroked: true,
      lineWidthMinPixels:2,
      getLineColor: lineColor,
      // Interactive props
      pickable: true,
      autoHighlight: true,
      onClick: info =>
        // eslint-disable-next-line
        info.object && alert(`${info.object.properties.name} (${info.object.properties.abbrev})`)
    })
  ]
});

map.addControl(deckOverlay);
map.addControl(new mapboxgl.NavigationControl());