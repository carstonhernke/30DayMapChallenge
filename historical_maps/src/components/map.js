import React, { useRef, useEffect, useState } from 'react';
import maplibregl from 'maplibre-gl';
import './map.css';

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

export default function Map(){
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng] = useState(-122.41669);
    const [lat] = useState(37.7853);
    const [zoom] = useState(13);

    useEffect(() => {
        if (map.current) return; //stops map from intializing more than once
        map.current = new maplibregl.Map({
          container: mapContainer.current,
          style: MAP_STYLE,
          center: [lng, lat],
          zoom: zoom
        });
      
      });

      return (
        <div className="map-wrap">
          <div ref={mapContainer} className="map" />
        </div>
      );
  }