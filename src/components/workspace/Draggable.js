import React, { Component } from "react";
import Utils from "../../Utils";

class Draggable extends Component {
  // all coordinates in this component state are
  // stored as fractions within the canvas (0-1)
  // Every time { clientX, clientY } is used, it is scaled
  // with this.props.imgSize

  constructor(props) {
    super();
    this.state = {
      isDragging: false,

      originalX: 0,
      originalY: 0,

      lastTranslateX: props.led.x,
      lastTranslateY: props.led.y
    };
  }

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown = ({ clientX, clientY }) => {
    const { width, height } = this.props.imgSize;

    // Skip if paintMode is 'erase'
    if (this.props.paintMode === Utils.paintModes.erase) {
      this.props.clickedLed(this.props.led);
      return;
    }

    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);

    // tell canvas that we are dragging something
    if (this.props.onDragStart) {
      this.props.onDragStart();
    }

    this.setState({
      originalX: clientX / width,
      originalY: clientY / height,
      isDragging: true
    });
  };

  handleMouseMove = ({ clientX, clientY }) => {
    const { isDragging } = this.state;
    // const { onDrag } = this.props;
    const { width, height } = this.props.imgSize;

    if (!isDragging) {
      return;
    }

    if (this.props.onDrag) {
      // this.props.onDrag();
    }

    let led2set = {id: this.props.led.id}; 

    led2set.x = clientX / width - this.state.originalX + this.state.lastTranslateX;
    led2set.y = clientY / height - this.state.originalY + this.state.lastTranslateY;
    // constrain values
    led2set.x = Utils.constrain(led2set.x, 0, 1);
    led2set.y = Utils.constrain(led2set.y, 0, 1);

    this.props.setLed(led2set);
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);

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

  getStyle = () => {
    const { x, y } = this.props.led;
    const { ledSize } = this.props;
    const { width, height } = this.props.imgSize;

    return {
      transform: `translate(${x * width - ledSize / 2}px, ${y * height - ledSize / 2}px)`,
      cursor: `${this.state.isDragging ? "grabbing" : "grab"}`,
      opacity: `${this.state.isDragging ? "0.5" : "0.8"}`,
      width: ledSize,
      height: ledSize
    };
  };

  render() {
    return (
      <div className="led" onMouseDown={this.handleMouseDown} style={this.getStyle()}>
        <p className="m-0">{this.props.led.id}</p>
      </div>
    );
  }
}

export default (Draggable);
