import * as ReactDOM from 'react-dom/client';

import React from 'react';
import DeckGL from '@deck.gl/react';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import Map from 'react-map-gl';
import {LineLayer} from '@deck.gl/layers';
import maplibregl from 'maplibre-gl';

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -122.41669,
    latitude: 37.7853,
    zoom: 6,
    pitch: 0,
    bearing: 0
  };

const MAP_STYLE = {
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

const layers = []

// Data to be used by the LineLayer
const data = [
    {
        hex: '832830fffffffff',
        count: 10,
    },
  ];

const hexagonLayer = new H3HexagonLayer({
    id: 'h3-hexagon-layer',
    data,
    pickable: true,
    wireframe: false,
    filled: true,
    extruded: true,
    elevationScale: 20,
    getHexagon: d => d.hex,
    getFillColor: d => [255, 100, 0],
    getElevation: d => d.count
    });

function App() {

    const layers = [
        hexagonLayer
      ];

    return (
        <div>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                getTooltip={({object}) => object && `${object.hex} count: ${object.count}`}
                >
                <Map mapStyle={MAP_STYLE} mapLib={maplibregl}/>
            </DeckGL>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
