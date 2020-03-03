import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, Button, ButtonToolbar } from "react-bootstrap";
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import PropTypes from "prop-types";
import Utils from "../../Utils";
import { connect } from "react-redux";

class EditTools extends Component {
  constructor(props) {
    super();
    this.state = { outputScaling: 255 };
  }

  handlePaintChange = event => {
    // remove active state from other buttons
    var active = document.getElementsByClassName("toolbox-btn active");
    active && (active[0].className = active[0].className.replace(" active", ""));
    // set this button to active
    event.target.className += " active";

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
    const { width, height } = this.props.imgSize;
    const { outputScaling } = this.state;

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
    let widthRefactor = widthActual > heightActual ? 1 : widthActual / heightActual; // scale back down to fractions
    let heightRefactor = heightActual > widthActual ? 1 : heightActual / widthActual;

    // const scaleFactor = Math.max(xMax - xMin, yMax - yMin) / outputScaling;

    let array = [];
    // TODO
    this.props.leds.forEach(led => {
      array.push(
        `{${Utils.map(led.x, xMin, xMax, 0, outputScaling * widthRefactor).toFixed(0)}, ${Utils.map(
          led.y,
          yMin,
          yMax,
          0,
          outputScaling * heightRefactor
        ).toFixed(0)}}`
      );
    });
    return `{${array.join(", ")}}`;
  };

  render() {
    const { onImgAdded, paintMode } = this.props;

    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card mx-auto">
          <Dropzone onImgAdded={onImgAdded} />
        </div>

        <ButtonToolbar className="btn-toolbar mx-auto px-3">
          <h4 className="mx-auto">{paintMode}</h4>
          <ToggleButtonGroup className="mx-auto w-100" vertical type="radio" name="toolbar">
            <Button
              className="btn btn-primary toolbox-btn active"
              value={Utils.paintModes.paint}
              id="paintBtn"
              onClick={this.handlePaintChange}
            >
              <i className="fas fa-paint-brush"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={Utils.paintModes.line}
              id="lineBtn"
              onClick={this.handlePaintChange}
            >
              <i className="fas fa-sort-numeric-down"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={Utils.paintModes.erase}
              id="eraseBtn"
              onClick={this.handlePaintChange}
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

const mapStateToProps = (state, ownProps) => {
  return {
    leds: state.project.leds,
    backImg: state.project.backImg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addLed: led => dispatch({ type: "ADD_LED", led }),
    deleteLed: led => dispatch({ type: "DEL_LED", led })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(EditTools);
