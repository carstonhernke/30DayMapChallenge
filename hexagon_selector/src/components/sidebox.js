import React, {useState} from 'react';
import { Button, Slider } from "@blueprintjs/core";

const emptyGeoJsonData = {
    "type": "FeatureCollection",
    "features": []
  }

export default function Sidebox(props){
      return (
        <div>
          <div className="title">Polygon to H3 Converter</div>
          <div className="optionBox">
            <div className="subtitle">Options</div>
            <Button icon="upload" text="Upload GeoJSON"/>
            <Button icon="trash" text="Reset" onClick={() => props.setGeoData(emptyGeoJsonData)}/>
            <div>H3 Index Resolution</div>
            <Slider
                        min={1}
                        max={16}
                        stepSize={1}
                        labelStepSize={5}
                        onChange={props.setH3Level}
                        value={props.h3Level}
                        handleHtmlProps={{ "aria-label": "example 1" }}
                    />
          </div>
          <div className="subtitle">Output</div>
          <div className="results">Area: {props.area}km2</div>
          <div className="results">Number of Hexagons: {props.hexagonCount}</div>
          <Button icon="download" text="Download Hexagons"/>
        </div>
      );
  }