import React, { Component } from "react";
import Dropzone from "./Dropzone";
import App from "../App";

export default class EditTools extends Component {


  uploadImg = () => {};

  getStyle = isActive => {
    return {
      background: isActive ? "rgb(239, 255, 220)" : "none"
    };
  };

  render() {
    const {tooling: {paintMode}, paintModeChanged} = this.props;

    return (
      <div className="editTools d-flex flex-column">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onImgAdded={this.props.onImgAdded} />
        </div>
        {/* <button className="btn button" id="isPaiting" onClick={this.uploadImg}>
          <i className="fas fa-file-upload"></i>
        </button> */}
        <button className="btn button" id="isPaiting" onClick={paintModeChanged.bind(this, App.paintModes.paint)} style={this.getStyle(paintMode==App.paintModes.paint)}>
          <i className="fas fa-paint-brush"></i>
        </button>
        <button className="btn button" id="isErase" onClick={paintModeChanged.bind(this, App.paintModes.erase)} style={this.getStyle(paintMode==App.paintModes.erase)}>
          <i className="fas fa-eraser"></i>
        </button>
      </div>
    );
  }
}
