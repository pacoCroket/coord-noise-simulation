import React, { Component } from "react";
import Utils from "../../Utils";

class Draggable extends Component {
  // all coordinates in the LED prop are
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
      lastTranslateY: props.led.y,

      xRelative: props.led.x * props.imgSize.width, // TODO save position in state (instead of only calculate at getStyle)
      yRelative: props.led.y * props.imgSize.height,

      isSelected: false,
      isTemp: props.isTemp
    };
  }

  componentDidUpdate = () => {
    const { left, top, width, height } = this.props.dragArea;
    const { xRelative, yRelative, isSelected } = this.state;
    if (xRelative > left && xRelative < left + width && yRelative > top && yRelative < top + height) {
      if (!isSelected) this.setState({ isSelected: true });
    } else if (isSelected) {
      this.setState({ isSelected: false });
    }
  };

  componentWillUnmount() {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    window.removeEventListener("touchmove", this.handleMouseMove);
    window.removeEventListener("touchend", this.handleMouseUp);
  }

  handleTouchStart = evt => {
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
    evt.preventDefault();
    const touch = evt.changedTouches[0];
    const { pageX, pageY } = touch;
    this.handleStartOrDown(pageX, pageY);
  };

  handleMouseDown = ({ clientX, clientY }) => {
    window.addEventListener("mousemove", this.handleMouseMove);
    window.addEventListener("mouseup", this.handleMouseUp);
    this.handleStartOrDown(clientX, clientY);
  };

  handleStartOrDown = (xPos, yPos) => {
    const { width, height } = this.props.imgSize;

    // Skip if paintMode is 'erase'
    if (this.props.paintMode === Utils.paintModes.erase) {
      this.props.clickedLed(this.props.led);
      return;
    }
    // tell canvas that we are dragging something
    if (!this.state.isTemp) {
      this.props.onDragStart();
    }

    this.setState({
      originalX: xPos / width,
      originalY: yPos / height,
      isDragging: true
    });
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
    const { isDragging } = this.state;
    const { width, height } = this.props.imgSize;

    if (!isDragging) {
      return;
    }

    if (!this.state.isTemp) {
      this.props.onDrag();
    }

    let led2set = { id: this.props.led.id };

    led2set.x = xPos / width - this.state.originalX + this.state.lastTranslateX;
    led2set.y = yPos / height - this.state.originalY + this.state.lastTranslateY;
    // constrain values
    led2set.x = Utils.constrain(led2set.x, 0, 1);
    led2set.y = Utils.constrain(led2set.y, 0, 1);

    this.props.setLed(led2set);
    this.setState({
      xRelative: led2set.x * width,
      yRelative: led2set.y * height
    });
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
    this.setState(
      {
        originalX: 0,
        originalY: 0,
        lastTranslateX: this.props.led.x,
        lastTranslateY: this.props.led.y,

        isDragging: false
      })
      if (!this.state.isTemp) {
        this.props.onDragEnd();
      }
  };

  getStyle = () => {
    const { ledSize } = this.props;
    const { xRelative, yRelative, isSelected, isDragging } = this.state;

    return {
      transform: `translate(${xRelative - ledSize / 2}px, ${yRelative - ledSize / 2}px)`,
      cursor: `${isDragging ? "grabbing" : "grab"}`,
      ...(isDragging && { opacity: "0.5" }),
      ...(isSelected && { backgroundColor: "blue" }),
      width: ledSize,
      height: ledSize
    };
  };

  render() {
    return (
      <div
        className="led"
        onMouseDown={this.handleMouseDown}
        onTouchStart={this.handleTouchStart}
        style={this.getStyle()}
      >
        <p className="m-0">{this.props.led.id}</p>
      </div>
    );
  }
}

export default Draggable;
