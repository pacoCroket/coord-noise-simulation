import React, { Component } from "react";
import PropTypes from "prop-types";
import Draggable from "./Draggable";
import App from "../App";

export default class Canvas extends Component {
  constructor() {
    super();
    this.state = { isDragging: false, isDraggingLed: false, tempLeds: [{}] };
  }

  static getCanvasPos = () => {
    return {
      cx: document.getElementById("canvas").getBoundingClientRect().left,
      cy: document.getElementById("canvas").getBoundingClientRect().top
    };
  };

  static getCanvasSize = () => {
    return {
      cw: document.getElementById("canvas").width,
      ch: document.getElementById("canvas").height
    };
  };

  setStyle = () => {
    console.log(document.getElementById("canvas").height());
    if (document.getElementById("canvas").height() > document.getElementById("canvas").width()) {
      return { height: 100 + "%", width: "auto" };
    } else {
      return { width: 100 + "%", height: "auto" };
    }
  };

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    const { cx, cy } = Canvas.getCanvasPos();
    const x = clientX - cx;
    const y = clientY - cy;

    this.setState({ tempLeds: [{ id: 0, x, y }] });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    this.setState({ isDragging: true });

    // append new Leds to tempLeds and update their pos
    if (this.props.tooling.paintMode === App.paintModes.line) {
      const { cx, cy } = Canvas.getCanvasPos();
      let dX = clientX - cx - this.state.tempLeds[0].x;
      let dY = clientY - cy - this.state.tempLeds[0].y;
      let dist = Math.sqrt(dX * dX + dY * dY);
      let tempLeds = [];

      for (var j = 0; j < dist / this.props.displayProps.ledSize; j++) {
        let fract = j * this.props.displayProps.ledSize;
        let x = this.state.tempLeds[0].x + dX * fract;
        let y = this.state.tempLeds[0].y + dY * fract;
        tempLeds.push({ id: j, x, y });
        // this.props.addLed({x, y});
      }

      this.setState({ tempLeds: [...tempLeds] });
    }
  };

  handleMouseUp = ({ clientX, clientY }) => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    // add the single first tempLed if paintMode === 'paint'
    if (this.props.tooling.paintMode === App.paintModes.paint && !this.state.isDraggingLed) {
      this.props.addLed({ x: this.state.tempLeds[0].x, y: this.state.tempLeds[0].y });
    } else if (this.props.tooling.paintMode === App.paintModes.line) {
      // add all of tempLeds
      this.state.tempLeds.forEach(led => {
        this.props.addLed({x: led.x, y:led.y})
      })
    }

    // remove tempLeds
    // this.setState({ isDragging: false, tempLeds: [] });
    this.setState({ isDragging: false});
  };

  onDragStart = () => this.setState({ isDraggingLed: true });
  // unelegant way of letting 'isDragging' stick for a bit longer
  onDragEnd = () => setTimeout(() => this.setState({ isDraggingLed: false }), 200);

  render() {
    const { ledSize } = this.props.displayProps;
    const { imgUrl, imgSize } = this.props.backImg;
    const { paintMode } = this.props.tooling;

    return (
      <div className="d-flex canvas" onMouseDown={this.handleMouseDown}>
        {/* TODO fit img to screen for all cases */}

        <img src={imgUrl} className="img-fluid backImg" id="canvas" alt="reference for leds"></img>

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
  leds: PropTypes.array.isRequired
};
