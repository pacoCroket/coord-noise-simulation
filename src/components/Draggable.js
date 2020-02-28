import React, { Component } from "react";
import styled, { css } from "styled-components";

export default class Draggable extends Component {
  state = {
    isDragging: false,

    originalX: 0,
    originalY: 0,

    translateX: 0,
    translateY: 0,

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

    this.setState(
      prevState => ({
        translateX: clientX - prevState.originalX + prevState.lastTranslateX,
        translateY: clientY - prevState.originalY + prevState.lastTranslateY
      }),
      () => {
        if (onDrag) {
          onDrag({
            translateX: this.state.translateX,
            translateY: this.state.translateY
          });
        }
      }
    );
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

    this.setState(
      {
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.state.translateX,
        lastTranslateY: this.state.translateY,

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
    let x = this.state.translateX < 0 ? 0 : this.state.translateX > xLim ? xLim : this.state.translateX;
    let y = this.state.translateY < 0 ? 0 : this.state.translateY > yLim ? yLim : this.state.translateY;
    return {
      transform: `translate(${x - ledSize / 2}px, ${y - ledSize / 2}px)`,
      cursor: `${this.state.isDragging ? "grabbing" : "grab"}`,
      opacity: `${this.state.isDragging ? "0.8" : "1"}`,
      width: ledSize,
      height: ledSize
    };
  };

  render() {
    const { children } = this.props;
    const { xLim, yLim } = this.props.imgSize;
    // const { translateX, translateY, isDragging } = this.state;

    return (
      <div className="led" onMouseDown={this.handleMouseDown} style={this.getStyle(xLim, yLim, this.props.ledSize)}>
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
