import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, Button, ButtonToolbar } from "react-bootstrap";
import App from "../App";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";

export default class EditTools extends Component {
  getActive = btnName => btnName === this.props.tooling.paintMode;

  handlePaintChange = event => {
    const { value } = event.target;
    if (value === undefined) return;
    this.props.paintModeChanged(value);
  };

  handleSliderChange = (event, value) => {
    this.props.ledSizeChanged(value);
  };

  render() {
    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>

        <h4 className="mx-auto">{this.props.tooling.paintMode}</h4>
        <ButtonToolbar className="btn-toolbar mx-auto px-3">
          <ToggleButtonGroup className="mx-auto w-100" vertical type="radio" name="toolbar">
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.paint}
              id="paintBtn"
              onClick={this.handlePaintChange}
              active={this.getActive(App.paintModes.paint)}
            >
              <i className="fas fa-paint-brush"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.line}
              id="lineBtn"
              onClick={this.handlePaintChange}
              active={this.getActive(App.paintModes.line)}
            >
              <i className="fas fa-sort-numeric-down"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.erase}
              id="eraseBtn"
              onClick={this.handlePaintChange}
              active={this.getActive(App.paintModes.erase)}
            >
              <i className="fas fa-eraser"></i>
            </Button>
          </ToggleButtonGroup>
        </ButtonToolbar>

        <div className="mx-4">
          <h4 className="mx-auto">LED size</h4>
          <Slider
            onChange={this.handleSliderChange}
            ValueLabelComponent={ValueLabelComponent}
            aria-label="custom thumb label"
            defaultValue={20}
            min={0}
            max={100}
          />
        </div>
      </div>
    );
  }
}

EditTools.propTypes = {
  tooling: PropTypes.object.isRequired,
  onImgAdded: PropTypes.func.isRequired,
  paintModeChanged: PropTypes.func.isRequired
};

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

ValueLabelComponent.propTypes = {
  children: PropTypes.element.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.number.isRequired
};
