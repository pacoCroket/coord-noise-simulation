import React, { Component } from "react";
import PropTypes from "prop-types";
import Draggable from "./Draggable";
import App from "../App";

export default class Canvas extends Component {
  constructor() {
    super();
    this.state = { isDragging: false, isDraggingLed: false, tempLeds: [] };
  }

  static getCanvasPos = () => {
    return {
      cx: document.getElementById("canvas").getBoundingClientRect().left,
      cy: document.getElementById("canvas").getBoundingClientRect().top
    };
  };

  getRelativeFractionPos = ({ clientX, clientY }) => {
    const { cx, cy } = Canvas.getCanvasPos();
    // scale x and y to be fractions of the image
    const { width, height } = this.props.backImg.imgSize;
    const x = (clientX - cx) / width;
    const y = (clientY - cy) / height;
    return { x, y };
  };

  setStyle = () => {
    console.log(document.getElementById("canvas").height());
    if (document.getElementById("canvas").height() > document.getElementById("canvas").width()) {
      return { height: 100 + "%", width: "auto" };
    } else {
      return { width: 100 + "%", height: "auto" };
    }
  };

  setLed = (led) => {    
    // TODO this led could be already relative to the canvas, not window
    const { x, y } = this.getRelativeFractionPos({ clientX: led.x, clientY: led.y });
    this.props.setLed(x, y);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    if (this.props.tooling.paintMode !== App.paintModes.erase && !this.state.isDraggingLed) {
      const { x, y } = this.getRelativeFractionPos({ clientX, clientY });
      this.setState({ tempLeds: [{ id: this.props.leds.length, x, y }], isDragging: true});
    }
  };

  handleMouseMove = ({ clientX, clientY }) => {
    this.setState({ isDragging: true });

    if (this.state.tempLeds[0] && !this.state.isDraggingLed) {
      const { x, y } = this.getRelativeFractionPos({ clientX, clientY });

      // append new Leds to tempLeds and update their pos
      if (this.props.tooling.paintMode === App.paintModes.line) {
        const dX = x - this.state.tempLeds[0].x;
        const dY = y - this.state.tempLeds[0].y;
        const dist = Math.sqrt(dX * dX + dY * dY);
        const fittingCount = dist / this.props.displayProps.ledSize;
        let tempLeds = [];

        // fit LEDs between original mouseDown and current mouse position
        for (var j = 0; j < fittingCount; j++) {
          let fract = (j * this.props.displayProps.ledSize) / dist;
          let newX = this.state.tempLeds[0].x + dX * fract;
          let newY = this.state.tempLeds[0].y + dY * fract;
          tempLeds.push({ id: this.props.leds.length + j, x: newX, y: newY });
        }
        // add the calculated leds to state
        this.setState({ tempLeds });
      } else if (this.props.tooling.paintMode === App.paintModes.paint) {
        this.setState({ tempLeds: [{ id: this.props.leds.length, x, y }] });
      }
    }
  };

  handleMouseUp = ({ clientX, clientY }) => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    // add the single first tempLed if paintMode === 'paint'
    if (this.props.tooling.paintMode === App.paintModes.paint && !this.state.isDraggingLed && this.state.tempLeds[0]) {
      this.props.addLed({ x: this.state.tempLeds[0].x, y: this.state.tempLeds[0].y });
    } else if (this.props.tooling.paintMode === App.paintModes.line) {
      // add all of tempLeds
      this.state.tempLeds.forEach(led => {
        this.props.addLed({ x: led.x, y: led.y });
      });
    }

    // remove tempLeds
    this.setState({ isDragging: false, tempLeds: [] });
  };

  onDragStart = () => {
    this.setState({ isDraggingLed: true });
    // also update it within this render loop
    this.state.isDraggingLed = true;
  };
  // unelegant way of letting 'isDragging' stick for a bit longer
  onDragEnd = () => setTimeout(() => this.setState({ isDraggingLed: false }), 200);

  handleImgageLoad = e => {
    this.props.onImgLoaded(e.target);
  };

  render() {
    const { ledSize } = this.props.displayProps;
    const { imgUrl, imgSize } = this.props.backImg;
    const { paintMode } = this.props.tooling;

    return (
      <div className="d-flex canvas" onMouseDown={this.handleMouseDown}>
        {/* TODO fit img to screen for all cases */}

        <img src={imgUrl} className="img-fluid backImg" onLoad={this.handleImgageLoad} id="canvas" alt="reference for leds"></img>

        {/* Show current LEDs */}
        {this.props.leds.map(led => (
          <Draggable
            className="mx-auto"
            key={led.id}
            paintMode={paintMode}
            isDragging={this.state.isDragging}
            led={led}
            imgSize={imgSize}
            ledSize={ledSize}
            clickedLed={this.props.clickedLed}
            setLed={this.setLed}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          ></Draggable>
        ))}

        {/* Show tempLeds */}
        {this.state.tempLeds.map(led => (
          <Draggable
            className="mx-auto"
            key={led.id}
            paintMode={paintMode}
            isDragging={this.state.isDragging}
            led={led}
            imgSize={imgSize}
            ledSize={ledSize}
            clickedLed={this.props.clickedLed}
            setLed={this.props.setLed}
            onDragStart={this.onDragStart}
            onDragEnd={this.onDragEnd}
          ></Draggable>
        ))}
      </div>
    );
  }
}

Canvas.propTypes = {
  backImg: PropTypes.object,
  tooling: PropTypes.object.isRequired,
  leds: PropTypes.array.isRequired,
  onImgLoaded: PropTypes.func.isRequired
};
