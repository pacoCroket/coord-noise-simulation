import React, { Component } from "react";
import Dropzone from "./Dropzone";
import { ToggleButtonGroup, ButtonGroup, Button, DropdownButton, Dropdown , ButtonToolbar} from "react-bootstrap";
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
    console.log(paintMode);

    return (
      <div className="d-flex flex-column editTools">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>

        <ButtonToolbar className="btn-toolbar mx-auto">
          <ToggleButtonGroup className="mx-auto px-2" vertical type="radio" name="options" defaultValue={1}>
            <Button className="toolbox-btn" 
          onClick={paintModeChanged.bind(this, App.paintModes.paint)}><i className="fas fa-paint-brush"></i></Button>
            <Button className="toolbox-btn" 
          onClick={paintModeChanged.bind(this, App.paintModes.erase)}><i className="fas fa-eraser"></i></Button>
          </ToggleButtonGroup>
        </ButtonToolbar>

        {/* <button
          className="btn button"
          id="isPaiting"
          onClick={paintModeChanged.bind(this, App.paintModes.paint)}
          style={this.getStyle(paintMode === App.paintModes.paint)}
        >
          
        </button>
        <button
          className="btn button"
          id="isErase"
          onClick={paintModeChanged.bind(this, App.paintModes.erase)}
          style={this.getStyle(paintMode === App.paintModes.erase)}
        >
          <i className="fas fa-eraser"></i>
        </button> */}

      </div>
    );
  }
}
