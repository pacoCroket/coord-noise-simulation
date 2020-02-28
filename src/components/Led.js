import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Led extends Component {
  getStyle = () => {
    return { left: `${this.props.led.x - this.props.ledSize/2}px`, top: `${this.props.led.y - this.props.ledSize/2}px`,
            width: this.props.ledSize, height: this.props.ledSize };
  };

  clicked = e => {
    console.log(e);
    this.props.led.x = e.clientX;
    this.props.led.y = e.clientY;
  };

  render() {
    return (
      <div className="led" style={this.getStyle()} onMouseDown={this.clicked}>
        <p className="m-0">{this.props.led.id}</p>
      </div>
    );
  }
}

Led.propTypes = {
  led: PropTypes.object.isRequired
};
