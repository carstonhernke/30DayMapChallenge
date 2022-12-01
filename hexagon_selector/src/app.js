import * as ReactDOM from 'react-dom/client';

import React, {useState} from 'react';
import DeckGL from '@deck.gl/react';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import Map from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { EditableGeoJsonLayer, DrawPolygonMode } from 'nebula.gl';
import * as turf from "@turf/turf";
import {polygonToCells} from "h3-js";
import Sidebox from './components/sidebox';

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

// Data to be used by the Hex Layer
const hexData = [
  ];

function convertToHexagons(geo, resolution) {
    if(geo['features'].length == 0){
        return []
    }
    var outputArray = []
    geo['features'].forEach((element, index) => {
        var cells = polygonToCells(element['geometry']['coordinates'], resolution, true)
        cells.forEach((element, index) => {
            var newElement = {
                hex: element,
                count: 1,
            };
            outputArray.push(newElement) ;
          });
      })    
    return outputArray
}

function getArea(geo){
    var area = (turf.area(geo)/1000000).toFixed(2)
    return area
}

const emptyGeoJsonData = {
    "type": "FeatureCollection",
    "features": []
  }

const selectedFeatureIndexes = [];

function App() {
    const [geoData, setGeoData] = useState(emptyGeoJsonData);
    const [area, setArea] = useState('N/A');
    const [h3Level, setH3Level] = useState(5)

    const editableLayer = new EditableGeoJsonLayer({
        id: 'geojson-layer',
        data: geoData,
        mode: DrawPolygonMode,
        selectedFeatureIndexes,
    
        onEdit: ({ editType, updatedData }) => {
            if(editType == 'addFeature'){
                console.log(`event: ${editType}`)
                console.log(`area: ${area}`)
                setGeoData(updatedData)
            }
        },
        });
    
    const hexagonLayer = new H3HexagonLayer({
        id: 'h3-hexagon-layer',
        data: convertToHexagons(geoData, h3Level),
        pickable: true,
        filled: true,
        extruded: false,
        elevationScale: 20,
        dataComparator: (oldData, newData) => {
            console.log(oldData.length == newData.length)
            return oldData.length == newData.length},
        getHexagon: d => d.hex,
        getFillColor: d => [255, 100, 0],
        getLineWidth: (1/h3Level)*200,
        getLineColor: d => [255, 255, 255],
        getElevation: d => 0
        });

    const layers = [
        editableLayer,
        hexagonLayer
    ];

    return (
        <div className='container'>
            <div className = "map">
                <DeckGL
                    initialViewState={INITIAL_VIEW_STATE}
                    controller={true}
                    layers={layers}
                    getTooltip={({object}) => object && `${object.hex} count: ${object.count}`}
                    >
                    <Map mapStyle={MAP_STYLE} mapLib={maplibregl}/>
                </DeckGL>
            </div>
            <div className = "sidebox">
                <Sidebox area={getArea(geoData)} hexagonCount = {convertToHexagons(geoData, h3Level).length} h3Level = {h3Level} setH3Level = {setH3Level} setGeoData = {setGeoData}/>
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
