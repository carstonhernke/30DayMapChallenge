import * as ReactDOM from 'react-dom/client';

import React, {useState, useEffect} from 'react';
import DeckGL from '@deck.gl/react';
import {WebMercatorViewport, FlyToInterpolator} from '@deck.gl/core';
import {H3HexagonLayer} from '@deck.gl/geo-layers';
import {Map as MapGL} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import { EditableGeoJsonLayer } from '@nebula.gl/layers';
import { DrawPolygonMode, ModifyMode, TranslateMode, DuplicateMode, ViewMode, DrawRectangleMode, DrawCircleFromCenterMode} from "@nebula.gl/edit-modes";
import * as turf from "@turf/turf";
import {polygonToCells, getHexagonAreaAvg, UNITS} from "h3-js";
import Sidebox from './components/sidebox';
import { Position, Toaster } from "@blueprintjs/core";
import {load} from '@loaders.gl/core';
import {JSONLoader as GeoJSONLoader} from '@loaders.gl/json';

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

// map of edit modes
var editModes = new Map();
editModes.set('ViewMode', ViewMode);
editModes.set('DrawPolygonMode', DrawPolygonMode);
editModes.set('ModifyMode', ModifyMode);
editModes.set('TranslateMode', TranslateMode);
editModes.set('DuplicateMode', DuplicateMode);
editModes.set('DrawRectangleMode', DrawRectangleMode);
editModes.set('DrawCircleFromCenterMode', DrawCircleFromCenterMode);


const layers = []

// Data to be used by the Hex Layer
const hexData = [
  ];

function convertToHexagons(geo, resolution) {
  if(geo['features'].length == 0){
      return []
  }
  // check if the number of hexagons is expected to exceed 200k
  if ((turf.area(geo) / getHexagonAreaAvg(resolution, UNITS.m2)) > 200000){
    alert("Too many hexagons!")
    return
  }
  var outputArray = []
  geo['features'].forEach((element, index) => {
      var cells = polygonToCells(element['geometry']['coordinates'], resolution, true)
      cells.forEach((element, index) => {
          outputArray.push(element) ;
        });
    })    
  return [...new Set(outputArray)]
}

function findOptimalH3Resolution(geo) {
  if(geo['features'].length === 0){
    return -1
  }
  for (let step = 1; step < 16; step++) {
    var outputArray = []
    geo['features'].forEach((element) => {
      var cells = polygonToCells(element['geometry']['coordinates'], step, true)
      cells.forEach((element) => {
          outputArray.push(element) ;
        });
    })
    if(outputArray.length > 5){
      return step
    }
    else {
      continue
    }
  }
  return -1
}

function getArea(geo) {
  var area = (turf.area(geo)/1000000).toFixed(2)
  return area
}

function showHexNumberWarning() {
  alert("Attempting to render too many hexbins. Create a smaller polygon or use a smaller resolution")
}

const emptyGeoJsonData = {
  "type": "FeatureCollection",
  "features": []
}

function zoomToGeo(geo, setInitialViewState){
  var bbox = turf.bbox(geo);
  var viewport = new WebMercatorViewport({  
    width: 800,
    height: 600
  }).fitBounds([
    [bbox[0]-((bbox[2]-bbox[0]) * .5), bbox[1]],
    [bbox[2], bbox[3]]
  ]);
  const {longitude, latitude, zoom} = viewport
  var newViewProps = {
    longitude: longitude,
    latitude: latitude,
    zoom: zoom,
    pitch: 0,
    bearing: 0,
    transitionDuration: 5000,
    transitionInterpolator: new FlyToInterpolator()
  }
  setInitialViewState(newViewProps)
}

function integrateNewFeatures(geo, newGeo) {
  const combinedData = {
    "type": "FeatureCollection",
    "features": geo.features.concat(newGeo.features)
  } 

  return combinedData
}

function App() {
    const [geoData, setGeoData] = useState(emptyGeoJsonData);
    const [editModeName, setEditModeName] = useState("DrawPolygonMode");
    const [selectedFeatureIndexes, setSelectedFeatureIndexes] = useState([0]);
    const [hexagons, setHexagons] = useState([]); 
    const [h3Level, setH3Level] = useState(4);
    const [uploadedFile, setUploadedFile] = useState();
    const [initialViewState, setInitialViewState] = useState(
      {
        longitude: -122.41669,
        latitude: 37.7853,
        zoom: 6,
        pitch: 0,
        bearing: 0
      }
    )

    // handle file upload
    useEffect(() => {
      async function parseData(uploadedFile){
        if(uploadedFile === undefined || uploadedFile === null){
          return
        }
        const parsedData = await load(uploadedFile, GeoJSONLoader);
        setGeoData(integrateNewFeatures(geoData, parsedData))
        var optimalH3Level = findOptimalH3Resolution(parsedData)
        setH3Level(optimalH3Level)
        setHexagons(convertToHexagons(parsedData,optimalH3Level))
        zoomToGeo(parsedData, setInitialViewState)
      }
      
      parseData(uploadedFile)
    }, [uploadedFile]);

    const editableLayer = new EditableGeoJsonLayer({
        data: geoData,
        mode: editModes.get(editModeName),
        selectedFeatureIndexes: selectedFeatureIndexes,
    
        onEdit: ({ updatedData }) => {
            setGeoData(updatedData)
            setHexagons(convertToHexagons(updatedData, h3Level))
        },
        });
    
    const hexagonLayer = new H3HexagonLayer({
        id: 'h3-hexagon-layer',
        data: hexagons,
        pickable: true,
        filled: true,
        extruded: false,
        elevationScale: 20,
        lineWidthUnits: 'pixels',
        getHexagon: d => d,
        getFillColor: [255, 100, 0],
        getLineWidth: 1,
        getLineColor: [255, 255, 255],
        getElevation: 0
        });

    const layers = [
        hexagonLayer,
        editableLayer
    ];

    return (
        <div className='container'>
            <div className = "map">
                <DeckGL
                    initialViewState={initialViewState}
                    controller={true}
                    layers={layers}
                    onClick={(info) => {
                      if (editModes.get(editModeName) === ViewMode)
                        if (info) {
                          setSelectedFeatureIndexes([info.index]);
                        } else {
                          setSelectedFeatureIndexes([]);
                        }
                    }}
                    >
                    <MapGL mapStyle={MAP_STYLE} mapLib={maplibregl}/>
                </DeckGL>
            </div>
            <div className = "sidebox">
                <Sidebox 
                  area={getArea(geoData)} 
                  geoData= {geoData}
                  hexagons = {hexagons} 
                  setHexagons = {setHexagons} 
                  setGeoData = {setGeoData} 
                  editModeName = {editModeName} 
                  setEditModeName = {setEditModeName} 
                  h3Level = {h3Level} 
                  setH3Level = {setH3Level} 
                  convertToHexagons = {convertToHexagons}
                  setSelectedFeatureIndexes = {setSelectedFeatureIndexes}
                  showHexNumberWarning = {showHexNumberWarning}
                  setUploadedFile = {setUploadedFile}
                />
            </div>
        </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
