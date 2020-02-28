import React, { Component } from "react";
import PropTypes from "prop-types";
import Draggable from "./Draggable";

export default class Led extends Component {
  getStyle = () => {
    return { width: this.props.ledSize, height: this.props.ledSize };
  };

  clicked = e => {
    console.log(e);
    this.props.led.x = e.clientX;
    this.props.led.y = e.clientY;
  };

  render() {
    return (
      <Draggable className="m-0">
        <div className="led m-0" style={this.getStyle()}>
          <p className="m-0">{this.props.led.id}</p>
        </div>
      </Draggable>
    );
  }
}

Led.propTypes = {
  led: PropTypes.object.isRequired
};
