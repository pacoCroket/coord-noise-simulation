import React, { Component } from "react";
import styled, { css } from "styled-components";
import App from "../App";

export default class Draggable extends Component {
  state = {
    isDragging: false,

    originalX: 0,
    originalY: 0,

    lastTranslateX: 0,
    lastTranslateY: 0
  };

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    // Skip if paintMode is 'erase'
    if (this.props.paintMode === App.paintModes.erase) return;

    if (this.props.onDragStart) {
      this.props.onDragStart();
    }

    this.setState({
      originalX: clientX,
      originalY: clientY,
      isDragging: true
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { isDragging } = this.state;
    const { onDrag } = this.props;

    if (!isDragging) {
      return;
    }

    this.setState( function(prevState) {
        let led2set = this.props.led;
        led2set.x = clientX - prevState.originalX + prevState.lastTranslateX;
        led2set.y = clientY - prevState.originalY + prevState.lastTranslateY;
        this.props.setLed(led2set);
    },
      () => {
        if (onDrag) {
          onDrag({
            translateX: this.state.this.props.led.x,
            translateY: this.state.this.props.led.y
          });
        }
      }
    );
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    // if paintMode == 'erase', this LED will be erased and this function returned
    if (this.props.clickedLed(this.props.led.id)) return;

    this.setState(
      {
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.props.led.x,
        lastTranslateY: this.props.led.y,

        isDragging: false
      },
      () => {
        if (this.props.onDragEnd) {
          this.props.onDragEnd();
        }
      }
    );
  };

  getStyle = (xLim, yLim, ledSize) => {
    //   limit the x and y between 0 and size of the image
    let x = this.props.led.x < 0 ? 0 : this.props.led.x > xLim ? xLim : this.props.led.x;
    let y = this.props.led.y < 0 ? 0 : this.props.led.y > yLim ? yLim : this.props.led.y;
    
    return {
      transform: `translate(${x - ledSize / 2}px, ${y - ledSize / 2}px)`,
      cursor: `${this.state.isDragging ? "grabbing" : "grab"}`,
      opacity: `${this.state.isDragging ? "0.8" : "1"}`,
      width: ledSize,
      height: ledSize
    };
  };

  render() {
    const { x, y } = this.props.imgSize;

    return (
      <div
        className="led"
        onMouseDown={this.handleMouseDown}
        style={this.getStyle(x, y, this.props.ledSize)}
      >
        <p className="m-0">{this.props.led.id}</p>
      </div>
    );
  }
}

const Container = styled.div.attrs({
  style: ({ x, y, isDragging }) => ({
    left: `${x}px`,
    top: `${y}px`,
    cursor: `${isDragging ? "grabbing" : "grab"}`,
    opacity: `${isDragging && "0.8"}`
  })
});
