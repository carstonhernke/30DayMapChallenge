import React, {useState} from 'react';


export default function Sidebox(props){
      return (
        <div>
          {/* <div className="title">Hexagon Helper</div> */}
          <div className="title">Wo ist die Hexe?</div>
          <div className="emoji">🧙‍♀️</div>
          <div className="subtitle">Options</div>
          <div className="subtitle">Output</div>
          <div className="results">Area: {props.area}km2</div>
          <div className="results">Number of Hexagons: {props.hexagonCount}</div>
        </div>
      );
  }