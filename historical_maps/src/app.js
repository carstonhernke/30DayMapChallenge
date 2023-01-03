import * as ReactDOM from 'react-dom/client';

import React from 'react';
import DeckGL from '@deck.gl/react';
import {TileLayer} from '@deck.gl/geo-layers';
import {BitmapLayer} from '@deck.gl/layers';
import Map from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import {MapView} from '@deck.gl/core';

// Viewport settings
const INITIAL_VIEW_STATE = {
    longitude: -93.467056,
    latitude: 44.934891,
    zoom: 12,
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

const tileLayer = new TileLayer({
    // https://wiki.openstreetmap.org/wiki/Slippy_map_tilenames#Tile_servers
    data: 'https://api.mapbox.com/v4/carston.3htkvlv5/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1IjoiY2Fyc3RvbiIsImEiOiJjajY0ZDR4MmgxcHl3MndtcW9jeTE2enBpIn0.K9j5-HQz8zLGevbbjF4vRQ',

    minZoom: 0,
    maxZoom: 19,
    tileSize: 256,

    opacity: .5,

    renderSubLayers: props => {
        const {
          bbox: {west, south, east, north}
        } = props.tile;
  
        return new BitmapLayer(props, {
          data: null,
          image: props.data,
          bounds: [west, south, east, north]
        });
      }

  });

const layers = [
    tileLayer
]

function App() {

    return (
        <div>
            <DeckGL
                initialViewState={INITIAL_VIEW_STATE}
                controller={true}
                layers={layers}
                views={new MapView({repeat: true})}
                >
                <Map mapStyle={MAP_STYLE} mapLib={maplibregl}/>
            </DeckGL>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
