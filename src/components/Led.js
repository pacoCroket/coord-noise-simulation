import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Led extends Component {
  getStyle = () => {
    return { transform: `translate(${this.props.led.x}px, ${this.props.led.y}px)`, };
  };

  clicked = (e) => {
      console.log(e)
      this.props.led.x = e.clientX;
      this.props.led.y = e.clientY;
  }

  render() {
    return (
      <div className="led" style={this.getStyle()} onMouseDown={this.clicked}>
        <p>{this.props.led.id}</p>
      </div>
    );
  }
}

Led.propTypes = {
  led: PropTypes.object.isRequired
};
