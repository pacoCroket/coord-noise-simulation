import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, Button, ButtonToolbar } from "react-bootstrap";
import App from "../App";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import Utilities from "../Utilities";

export default class EditTools extends Component {
  constructor(props) {
    super();
    this.state = { outputScaling: props.tooling.outputScaling };
  }

  getActive = btnName => btnName === this.props.tooling.paintMode;

  handlePaintChange = event => {
    // TODO BUG sometimes value == undefined
    const { value } = event.target;
    if (value === undefined) return;
    this.props.paintModeChanged(value);
  };

  handleSliderChange = (event, value) => {
    this.props.ledSizeChanged(value);
  };

  handleOutputScaling = value => {
    this.setState({ outputScaling: value });
    this.props.outputScalingChanged(parseInt(value));
  };

  getOutput = () => {
    const { outputScaling } = this.props.tooling;
    const { width, height } = this.props.imgSize;

    let xMin = outputScaling;
    let yMin = outputScaling;
    let xMax = 0;
    let yMax = 0;

    this.props.leds.forEach(led => {
      if (led.x > xMax) xMax = led.x;
      if (led.y > yMax) yMax = led.y;
      if (led.x < xMin) xMin = led.x;
      if (led.y < yMin) yMin = led.y;
    });

    // maintain w/h relationship. Values are still fractions
    let widthActual = (xMax - xMin) * width; // scale up to real values
    let heightActual = (yMax - yMin) * height;
    let widthRefactor = widthActual > heightActual ? 1 : (widthActual / heightActual); // scale back down to fractions
    let heightRefactor = heightActual > widthActual ? 1 : (heightActual / widthActual);

    // const scaleFactor = Math.max(xMax - xMin, yMax - yMin) / outputScaling;

    let array = [];
    // TODO
    this.props.leds.forEach(led => {
      array.push(
        `{${Utilities.map(led.x, xMin, xMax, 0, outputScaling*widthRefactor).toFixed(0)}, ${Utilities.map(led.y, yMin, yMax, 0, outputScaling*heightRefactor).toFixed(0)}}`);
    });
    return `{${array.join(", ")}}`;
  };

  render() {
    const { onImgAdded, tooling } = this.props;

    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card mx-auto">
          <Dropzone onImgAdded={onImgAdded} />
        </div>

        <ButtonToolbar className="btn-toolbar mx-auto px-3">
        <h4 className="mx-auto">{tooling.paintMode}</h4>
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
          {/* TODO feature to estimate real LED size */}
          <Slider
            onChange={this.handleSliderChange}
            ValueLabelComponent={ValueLabelComponent}
            aria-label="custom thumb label"
            defaultValue={20}
            min={0}
            max={100}
          />
          <hr className="my-2"></hr>

          <h4 className="mx-auto">Scale out</h4>
          <textarea
            value={this.state.outputScaling}
            onChange={e => this.handleOutputScaling(e.target.value.replace(/\D/g, ""))}
            cols={12}
            rows={1}
            className="outputField"
          ></textarea>

          <h4 className="mx-auto">Output</h4>
          <textarea
            value={this.getOutput()}
            className="outputField"
            id="ouputField"
            placeholder="output"
            cols={12}
            rows={5}
            readOnly
          ></textarea>

          {/* <Button className="btn btn-primary toolbox-btn w-100 mx-auto" value="output" id="output" onClick={this.handleOutput}>
            <i className="fas fa-microchip"></i>
          </Button> */}
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
