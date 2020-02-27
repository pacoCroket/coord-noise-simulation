import React, { Component } from "react";
import Led from "./Led";
import PropTypes from "prop-types";

export default class Canvas extends Component {
  render() {
    return (
      <div className="canvas">
        {this.props.leds.map(led => (
          <Led led={led} key={led.id}></Led>
        ))}
      </div>
    );
  }
}

Canvas.propTypes = {
//   backImg: PropTypes.object.isRequired,
  tooling: PropTypes.object.isRequired,
  leds: PropTypes.array.isRequired
};
