import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, ButtonGroup, Button, DropdownButton, Dropdown, ButtonToolbar } from "react-bootstrap";
import App from "../App";

export default class EditTools extends Component {
  getStyle = isActive => {
    console.log(isActive);
    return {
      background: isActive ? "rgb(239, 255, 220)" : "none"
    };
  };

  render() {
    const {
      tooling: { paintMode },
      paintModeChanged
    } = this.props;

    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>

        <ButtonToolbar className="btn-toolbar mx-auto">
          <ToggleButtonGroup className="mx-auto px-2 w-100" vertical type="radio" name="toolbar">
            <Button className="btn btn-primary toolbox-btn" onClick={paintModeChanged.bind(this, App.paintModes.paint)}>
              <i className="fas fa-paint-brush"></i>
            </Button>
            <Button className="btn btn-primary toolbox-btn" onClick={paintModeChanged.bind(this, App.paintModes.line)}>
              <i className="fas fa-sort-numeric-down"></i>
            </Button>
            <Button className="btn btn-primary toolbox-btn" onClick={paintModeChanged.bind(this, App.paintModes.erase)} active>
              <i className="fas fa-eraser"></i>
            </Button>
          </ToggleButtonGroup>
        </ButtonToolbar>
      </div>
    );
  }
}
