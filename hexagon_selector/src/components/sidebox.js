import React, {useState} from 'react';
import { Button, Slider, Menu, MenuDivider, MenuItem, Icon } from "@blueprintjs/core";
import * as turf from "@turf/turf";
import {getHexagonAreaAvg, UNITS} from "h3-js";

const emptyGeoJsonData = {
    "type": "FeatureCollection",
    "features": []
}

function handleSliderChange(selectedLevel, geoData, setH3Level, setHexagons, convertToHexagons,showHexNumberWarning) {
    // check if slider will result in too many hexagons
    if ((turf.area(geoData) / getHexagonAreaAvg(selectedLevel, UNITS.m2)) > 200000){
        //setH3Level(4)
        //setHexagons(convertToHexagons(geoData,4))
        return
      }
    else {
        setH3Level(selectedLevel)
        setHexagons(convertToHexagons(geoData,selectedLevel))
    }
}

function handleTrashButtonClick(emptyGeoJsonData, setGeoData, setHexagons, setSelectedFeatureIndexes){
    setGeoData(emptyGeoJsonData)
    setHexagons([])
    setSelectedFeatureIndexes([0])
}

export default function Sidebox(props){
      return (
        <div className="sideboxContent">
          <div className="title">Polygon to H3 Converter</div>
          <div className="optionBox">
            <div className="subtitle">Options</div>
            <Menu className='menu'>
                <MenuDivider title="Editor Mode" />
                <MenuItem 
                    icon="select"
                    text="Select Polygon" 
                    selected={props.editModeName == "ViewMode"}
                    onClick={() => props.setEditModeName("ViewMode")}
                />  
                <MenuItem 
                    icon="new-object"
                    text="Add Polygon" 
                    selected={props.editModeName == "DrawPolygonMode"}
                    onClick={() => props.setEditModeName("DrawPolygonMode")}
                />   
                <MenuItem 
                    icon="edit"
                    text="Edit Points" 
                    selected={props.editModeName == "ModifyMode"}
                    onClick={() => props.setEditModeName("ModifyMode")}
                />  
                <MenuItem 
                    icon="move"
                    text="Move Polygon" 
                    selected={props.editModeName == "TranslateMode"}
                    onClick={() => props.setEditModeName("TranslateMode")}
                />  
                <MenuItem 
                    icon="duplicate"
                    text="Duplicate Polygon" 
                    selected={props.editModeName == "DuplicateMode"}
                    onClick={() => props.setEditModeName("DuplicateMode")}
                />
                <MenuDivider title="Settings" />
                <MenuItem 
                    icon="upload"
                    text="Upload GeoJSON" 
                />
                <MenuItem 
                    icon="trash"
                    text="Reset Geography" 
                    onClick={() => handleTrashButtonClick(emptyGeoJsonData, props.setGeoData, props.setHexagons, props.setSelectedFeatureIndexes)}
                />
            </Menu>
            <div>H3 Index Resolution</div>
            <Slider
                className='menu'
                min={1}
                max={15}
                stepSize={1}
                labelStepSize={5}
                onChange={(selectedLevel) => handleSliderChange(selectedLevel,
                                                                 props.geoData, 
                                                                 props.setH3Level, 
                                                                 props.setHexagons, 
                                                                 props.convertToHexagons,
                                                                 props.showHexNumberWarning)}
                value={props.h3Level}
                handleHtmlProps={{ "aria-label": "example 1" }}
                    />
          </div>
          <div className="subtitle">Output</div>
          <div className="results">Area: {props.area}km2</div>
          <div className="results">Number of Hexagons: {props.hexagons.length}</div>
            <Menu className='menu'>
                    <MenuItem 
                        icon="download"
                        text="Download" 
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(props.hexagons)
                          )}`}
                        download="hexagons.json"
                    />    
            </Menu>
        </div>
      );
  }