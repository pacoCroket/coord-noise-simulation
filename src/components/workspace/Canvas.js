import React, { Component } from "react";
import Draggable from "./Draggable";
import Image from "react-bootstrap/Image";
import Utils from "../../Utils";
import { isEmpty } from "underscore";
import Dropzone from "./Dropzone";
import Spinner from "react-bootstrap/Spinner";

class Canvas extends Component {
  constructor() {
    super();
    this.state = {
      isDragging: false,
      isDraggingLed: false,
      tempLeds: []
    };
  }

  // Update image dimensions when resizing window
  updateImageDimensions = () => {
    this.props.updateImageDimensions();
  };

  componentDidMount() {
    window.addEventListener("resize", this.updateImageDimensions);
  }
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateImageDimensions);
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }

  getRelativeFractionPos = (xPos, yPos) => {
    const { imgX, imgY } = this.props.imgPos;
    // scale x and y to be fractions of the image
    const { width, height } = this.props.imgSize;
    const x = (xPos - imgX) / width;
    const y = (yPos - imgY) / height;
    return { x, y };
  };

  setLed = led => {
    // TODO this led could be already relative to the canvas, not window
    const { x, y } = this.getRelativeFractionPos(led.x, led.y);
    this.props.setLed(x, y);
  };

  handleTouchStart = evt => {
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    evt.preventDefault();
    const touch = evt.changedTouches[0];
    const { pageX, pageY } = touch;
    this.handleStartOrDown(pageX, pageY);
  };

  handleMouseDown = ({ clientX, clientY }) => {
    if (isEmpty(this.props.imgURL)) return;
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    this.handleStartOrDown(clientX, clientY);
  };

  handleStartOrDown = (xPos, yPos) => {
    if (this.props.paintMode !== Utils.paintModes.erase && !this.state.isDraggingLed) {
      const { x, y } = this.getRelativeFractionPos(xPos, yPos);
      this.setState({ tempLeds: [{ id: this.props.leds.length, x, y }], isDragging: true });
    }
  };

  handleMouseMove = ({ clientX, clientY }) => {
    this.handleMove(clientX, clientY);
  };

  handleTouchMove = evt => {
    evt.preventDefault();
    const touch = evt.changedTouches[0];
    const { pageX, pageY } = touch;
    this.handleMove(pageX, pageY);
  };

  handleMove = (xPos, yPos) => {
    if (isEmpty(this.props.imgURL)) return;
    this.setState({ isDragging: true });

    if (this.state.tempLeds[0] && !this.state.isDraggingLed) {
      let { x, y } = this.getRelativeFractionPos(xPos, yPos);
      const { width, height } = this.props.imgSize;

      // append new Leds to tempLeds and update their pos
      if (this.props.paintMode === Utils.paintModes.line) {
        // scale fractional coordinates back to 'regular' coordinates
        const dX = (x - this.state.tempLeds[0].x) * width;
        const dY = (y - this.state.tempLeds[0].y) * height;
        const dist = Math.sqrt(dX * dX + dY * dY);
        const fittingCount = dist / this.props.ledSize;
        let tempLeds = [];

        // fit LEDs between original mouseDown and current mouse position
        for (var j = 0; j < fittingCount; j++) {
          // scale back down to fractional coordinates
          let fract = (j * this.props.ledSize) / dist;
          let newX = (this.state.tempLeds[0].x * width + dX * fract) / width;
          let newY = (this.state.tempLeds[0].y * height + dY * fract) / height;
          // skip if out of canvas
          if (newX < 0 || newX > 1 || newY < 0 || newY > 1) continue;

          tempLeds.push({ id: this.props.leds.length + j, x: newX, y: newY });
        }
        // add the calculated leds to state
        this.setState({ tempLeds });
      } else if (this.props.paintMode === Utils.paintModes.paint) {
        // constrain to canvas
        x = Utils.constrain(x, 0, 1);
        y = Utils.constrain(y, 0, 1);
        this.setState({ tempLeds: [{ id: this.props.leds.length, x, y }] });
      }
    }
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    this.handleUpOrEnd();
  };

  handleTouchEnd = evt => {
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
    evt.preventDefault();
    this.handleUpOrEnd();
  };

  handleUpOrEnd = () => {
    if (isEmpty(this.props.imgURL)) return;
    // add the single first tempLed if paintMode === 'paint'
    if (
      this.props.paintMode === Utils.paintModes.paint &&
      !this.state.isDraggingLed &&
      this.state.tempLeds[0]
    ) {
      // const led = { id: this.props.leds.length, x: this.state.tempLeds[0].x, y: this.state.tempLeds[0].y };
      this.props.addLed(this.state.tempLeds[0]);
    } else if (this.props.paintMode === Utils.paintModes.line) {
      // add all of tempLeds
      this.state.tempLeds.forEach(led => {
        this.props.addLed(led);
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

  // unused
  onDrag = led => {
    this.setState({ tempLeds: [led] });
  };

  // unelegant way of letting 'isDragging' stick for a bit longer with timeout
  onDragEnd = () => setTimeout(() => this.setState({ isDraggingLed: false }), 200);

  render() {
    const {
      paintMode,
      ledSize,
      imgSize,
      imgPos,
      imgURL,
      leds,
      setLed,
      clickedLed,
      handleUploadImage,
      uploading
    } = this.props;

    return (
      <div
        className="paintArea noSel"
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
        id="paintArea"
      >
        {/* TODO fit img to screen for all cases */}
        <div className="d-flex">
          <div id="canvas">
            {!isEmpty(imgURL) ? (
              <Image
                src={imgURL}
                className="img-fluid backImg"
                // style={this.setImgStyle()}
                onLoad={this.updateImageDimensions}
                onLoadedData={this.updateImageDimensions}
                alt="reference for leds"
                fluid={true}
              ></Image>
            ) : uploading ? (
              <div className="loadSpinner">
                <Spinner animation="border" />
              </div>
            ) : (
              <div className="Card mx-auto">
                <Dropzone handleUploadImage={handleUploadImage} />
              </div>
            )}
          </div>

          {/* Show current LEDs */}
          {leds.map(led => (
            <Draggable
              className=""
              key={led.id}
              paintMode={paintMode}
              isDragging={this.state.isDragging}
              led={led}
              imgSize={imgSize}
              imgPos={imgPos}
              ledSize={ledSize}
              clickedLed={clickedLed}
              setLed={setLed}
              onDragStart={this.onDragStart}
              onDrag={this.onDrag}
              onDragEnd={this.onDragEnd}
            ></Draggable>
          ))}

          {/* Show tempLeds */}
          {this.state.tempLeds.map(led => (
            <Draggable
              className=""
              key={led.id}
              paintMode={paintMode}
              isDragging={this.state.isDragging}
              led={led}
              imgSize={imgSize}
              imgPos={imgPos}
              ledSize={ledSize}
              clickedLed={clickedLed}
              setLed={setLed}
              onDragStart={this.onDragStart}
              onDrag={this.onDrag}
              onDragEnd={this.onDragEnd}
            ></Draggable>
          ))}
        </div>
      </div>
    );
  }
}

export default Canvas;
