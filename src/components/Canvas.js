import React, { Component } from "react";
import Led from "./Led";
import PropTypes from "prop-types";

export default class Canvas extends Component {
  setStyle = () => {
      console.log(document.getElementById("canvas").height())
    if (document.getElementById("canvas").height() > document.getElementById("canvas").width()) {
      return { height: 100+'%', width: "auto" };
    } else {
      return { width: 100+'%', height: "auto" };
    }
  };

  render() {
    return (
      <div className="container canvas mx-0 p-0">
        <img
          src="https://via.placeholder.com/1200x600"
          className="backImg"
          id="canvas"
          alt="reference leds"
        //   style={this.setStyle}
        ></img>
        {this.props.leds.map(led => (
          <Led led={led} key={led.id} ledSize={this.props.displayProps.ledSize}></Led>
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
