import React, {useState, useRef} from 'react';
import { Slider, Menu, MenuDivider, MenuItem, Callout } from "@blueprintjs/core";
import * as turf from "@turf/turf";
import {cellToBoundary, getHexagonAreaAvg, UNITS} from "h3-js";

const emptyGeoJsonData = {
    "type": "FeatureCollection",
    "features": []
}

function getCSVfromHexagons(hexagons){
    if(hexagons === []) {
        return null
    }
    let csvContent = "h3_index\r\n";
    console.log(hexagons)
    hexagons.forEach(function(hex) {
        let row = hex;
        csvContent += row + "\r\n";
    });

    return csvContent
}


function getGeoJSONFromHexagons(hexagons) {
    var features = []
    hexagons.forEach((element) => {
        var geo = cellToBoundary(element)
        var newObject = {
            "type": "Feature",
            "geometry": {
              "type": "Polygon",
              "coordinates": geo
            },
            "properties": {
              "h3_index": element
            }
          }
        features.push(newObject)
      }
    )
    const geoJsonData = {
        "type": "FeatureCollection",
        "features": features
    }
    return geoJsonData
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

function handleTrashButtonClick(emptyGeoJsonData, setGeoData, setHexagons, setSelectedFeatureIndexes, setUploadedFile){
    setGeoData(emptyGeoJsonData)
    setHexagons([])
    setSelectedFeatureIndexes([0])
    setUploadedFile()
}

export default function Sidebox(props){
	const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);
    const fileInput = useRef(null)

    const handleFileUploadClick = (e) => {
        console.log('upload clicked')
        fileInput.current
        fileInput.current.click()
    }

    function handleFileInput(event, setUploadedFile) {
        console.log(event)
        // handle validations
        setUploadedFile(event.target.files[0])
    }

    return (
        <div className="sideboxContent">
          <div className="title">Polygon to H3 Converter</div>
          <Callout>This tool allows you to convert geographic data from polygons to h3 indexes.</Callout>
          <div className="optionBox">
            <Menu className='menu'>
                <MenuDivider title="Import"/>
                    <MenuItem 
                        icon="upload"
                        text="Upload GeoJSON"
                        onClick={() => handleFileUploadClick()}
                    />
                <MenuDivider title="Edit"/>
                <MenuItem text="Editor Mode">
                    <MenuDivider title="Add" />
                    <MenuItem 
                        icon="new-object"
                        text="Add Rectangle" 
                        selected={props.editModeName == "DrawRectangleMode"}
                        onClick={() => props.setEditModeName("DrawRectangleMode")}
                    />  
                    <MenuItem 
                        icon="new-object"
                        text="Add Circle" 
                        selected={props.editModeName == "DrawCircleFromCenterMode"}
                        onClick={() => props.setEditModeName("DrawCircleFromCenterMode")}
                    />  
                    <MenuItem 
                        icon="new-object"
                        text="Add Polygon" 
                        selected={props.editModeName == "DrawPolygonMode"}
                        onClick={() => props.setEditModeName("DrawPolygonMode")}
                    />   
                    <MenuDivider title="Edit" />
                    <MenuItem 
                        icon="select"
                        text="Select Polygon" 
                        selected={props.editModeName == "ViewMode"}
                        onClick={() => props.setEditModeName("ViewMode")}
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
                </MenuItem>
                <input hidden id="input" ref={fileInput} type="file" onChange={(event) => handleFileInput(event, props.setUploadedFile)}/>
                <MenuItem 
                    icon="trash"
                    text="Reset Geography" 
                    onClick={() => handleTrashButtonClick(emptyGeoJsonData, props.setGeoData, props.setHexagons, props.setSelectedFeatureIndexes, props.setUploadedFile)}
                />
                <MenuDivider title="Output" />
                <MenuItem 
                        icon="download"
                        text="Download" 
                    >
                        <MenuItem 
                        icon="download"
                        text="H3 Indexes as JSON" 
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(props.hexagons)
                            )}`}
                        download={`H3_export_${Date.now()}.json`}
                        />  
                        <MenuItem 
                        icon="download"
                        text="H3 Geography as GeoJSON" 
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(getGeoJSONFromHexagons(props.hexagons))
                            )}`}
                        download={`H3_export_${Date.now()}.geojson`}
                        />
                        <MenuItem 
                        icon="download"
                        text="H3 Indexes as CSV" 
                        href={`data:text/csv;charset=utf-8,${encodeURIComponent(
                            getCSVfromHexagons(props.hexagons)
                            )}`}
                        download={`H3_export_${Date.now()}.csv`}
                        />  
                        <MenuItem 
                        icon="download"
                        text="Polygons as GeoJSON" 
                        href={`data:text/json;charset=utf-8,${encodeURIComponent(
                            JSON.stringify(props.geoData)
                            )}`}
                        download={`polygons_${Date.now()}.json`}
                        />  
                    </MenuItem>
            </Menu>
          <div className="subtitle">Settings</div>
          <div>H3 Index Resolution</div>
            <Slider
                className='menu'
                min={1}
                max={15}
                stepSize={1}
                labelStepSize={2}
                onChange={(selectedLevel) => handleSliderChange(selectedLevel,
                                                                 props.geoData, 
                                                                 props.setH3Level, 
                                                                 props.setHexagons, 
                                                                 props.convertToHexagons,
                                                                 props.showHexNumberWarning,
                                                                 props.setUploadedFile)}
                value={props.h3Level}
                handleHtmlProps={{ "aria-label": "example 1" }}
                    />
          </div>
          <div className="subtitle">Statistics</div>
          <div className="results">Polygon Area: {props.area}km2</div>
          <div className="results">Number of Hexagons: {props.hexagons.length}</div>
        </div>
      );
  }