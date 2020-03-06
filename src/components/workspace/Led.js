import React, { Component } from "react";
import PropTypes from "prop-types";

export default class Led extends Component {
  render() {
    return (
      <div className="led">
        <p className="m-0">{this.props.led.id}</p>
      </div>
    );
  }
}

Led.propTypes = {
  led: PropTypes.object.isRequired
};
