import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, ButtonGroup, Button, DropdownButton, Dropdown, ButtonToolbar } from "react-bootstrap";
import App from "../App";

export default class EditTools extends Component {
  constructor() {
    super();
  }

  getActive = btnName => btnName === this.props.tooling.paintMode

  render() {
    const { paintModeChanged } = this.props;

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
              name="paint"
              id="paintBtn"
              onClick={event => paintModeChanged(App.paintModes.paint)}
              active={this.getActive(App.paintModes.paint)}
            >
              <i className="fas fa-paint-brush"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              name="line"
              id="lineBtn"
              onClick={event => paintModeChanged(App.paintModes.line)}
              active={this.getActive(App.paintModes.line)}
            >
              <i className="fas fa-sort-numeric-down"></i>
            </Button>
            <Button
              className="btn btn-primary toolbox-btn"
              name="erase"
              id="eraseBtn"
              onClick={event => paintModeChanged(App.paintModes.erase)}
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
