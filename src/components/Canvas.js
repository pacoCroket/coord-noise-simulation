import React, { Component } from "react";
import PropTypes from "prop-types";
import Draggable from "./Draggable";

export default class Canvas extends Component {
    constructor() {
        super();
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }
  setStyle = () => {
    console.log(document.getElementById("canvas").height());
    if (document.getElementById("canvas").height() > document.getElementById("canvas").width()) {
      return { height: 100 + "%", width: "auto" };
    } else {
      return { width: 100 + "%", height: "auto" };
    }
  };

  handleDoubleClick = ({ clientX, clientY }) => {
      const x = clientX - document.getElementById("canvas").getBoundingClientRect().left;
      const y = clientY - document.getElementById("canvas").getBoundingClientRect().top;
    this.props.addLed({ x , y });
  }

  render() {
    const { ledSize } = this.props.displayProps;
    const { imgUrl, imgSize } = this.props.backImg;
    const { paintMode } = this.props.tooling;

    return (
      <div className="d-flex canvas" 
      onDoubleClick={this.handleDoubleClick}>
          {/* TODO fit img to screen for all cases */}
        <img
          src={imgUrl}
          className="img-fluid backImg"
          id="canvas"
          alt="reference for leds"
        ></img>
        {this.props.leds.map(led => (
          <Draggable
            className="mx-auto"
            key={led.id}
            paintMode={paintMode}
            led={led}
            imgSize={imgSize}
            ledSize={ledSize}
            clickedLed={this.props.clickedLed}
            setLed={this.props.setLed}
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
