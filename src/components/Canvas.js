import React, { Component } from "react";
import PropTypes from "prop-types";
import Draggable from "./Draggable";

export default class Canvas extends Component {
  setStyle = () => {
    console.log(document.getElementById("canvas").height());
    if (document.getElementById("canvas").height() > document.getElementById("canvas").width()) {
      return { height: 100 + "%", width: "auto" };
    } else {
      return { width: 100 + "%", height: "auto" };
    }
  };

  render() {
    const { ledSize } = this.props.displayProps;
    const { imgSize } = this.props.backImg;

    return (
      <div className="d-flex canvas">
          {/* TODO fit img to screen for all cases */}
        <img
          src="https://via.placeholder.com/1200x200"
          className="img-fluid"
          id="canvas"
          alt="reference leds"
          onClick={this.props.addLed}
        ></img>
        {this.props.leds.map(led => (
          <Draggable
            className="mx-auto"
            key={led.id}
            led={led}
            imgSize={imgSize}
            ledSize={ledSize}
            clickedLed={this.props.clickedLed}
          ></Draggable>
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
