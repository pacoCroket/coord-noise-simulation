import React, { Component } from "react";
import Led from "./Led";
import PropTypes from "prop-types";

export default class Canvas extends Component {
  render() {
    return (
      <div className="canvas container">
        <img src="" className="backImg" id="canvas">
            
        </img>
        {this.props.leds.map(led => (
          <Led led={led} key={led.id}></Led>
        ))}
      </div>
    );
  }
}

Canvas.propTypes = {
  backImg: PropTypes.object,
  tooling: PropTypes.object.isRequired,
  leds: PropTypes.array.isRequired
};
