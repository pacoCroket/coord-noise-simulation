import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, ButtonGroup, Button, DropdownButton, Dropdown, ButtonToolbar } from "react-bootstrap";
import App from "../App";
import PropTypes from "prop-types";

export default class EditTools extends Component {
  constructor() {
    super();
  }

  getActive = btnName => btnName === this.props.tooling.paintMode;

  handleChange = event => {
    const { value } = event.target;
    this.props.paintModeChanged(value);
  };

  render() {
    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>
        <div className="mx-auto">{this.props.tooling.paintMode}</div>

        <ButtonToolbar className="btn-toolbar mx-auto">
          <ToggleButtonGroup className="mx-auto px-2 w-100" vertical type="radio" name="toolbar">
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.paint}
              id="paintBtn"
              onClick={this.handleChange}
              active={this.getActive(App.paintModes.paint)}
            >
              <i className="fas fa-paint-brush"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.line}
              id="lineBtn"
              onClick={this.handleChange}
              active={this.getActive(App.paintModes.line)}
            >
              <i className="fas fa-sort-numeric-down"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              value={App.paintModes.erase}
              id="eraseBtn"
              onClick={this.handleChange}
              active={this.getActive(App.paintModes.erase)}
            >
              <i className="fas fa-eraser"></i>
            </Button>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}

EditTools.propTypes = {
  tooling: PropTypes.object.isRequired,
  onImgAdded: PropTypes.func.isRequired,
  paintModeChanged: PropTypes.func.isRequired
};
