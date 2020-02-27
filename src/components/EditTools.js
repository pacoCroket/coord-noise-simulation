import React, { Component } from "react";
import Dropzone from "./Dropzone";

export default class EditTools extends Component {
  setIsPainting = () => {
    this.props.tooling.isPainting = true;
    this.props.tooling.isErasing = false;
    console.log(this.props.tooling);
  };

  setIsErasing = () => {
    this.props.tooling.isErasing = true;
    this.props.tooling.isPainting = false;
    console.log(this.props.tooling);
  };

  uploadImg = () => {};

  getStyle = isActive => {
    return {
      background: isActive ? "rgb(239, 255, 220)" : "none"
    };
  };

  render() {
    const { isPainting, isErasing } = this.props.tooling;

    return (
      <div className="editTools d-flex flex-column">
        {/* <input type="file" className="myButton" id="uploadImg" name="imgFile"></input> */}
        <div className="Card">
          <Dropzone onFilesAdded={console.log} />
        </div>
        <button className="btn button" id="isPaiting" onClick={this.uploadImg}>
          <i className="fas fa-file-upload"></i>
        </button>
        <button className="btn button" id="isPaiting" onClick={this.setIsPainting} style={this.getStyle(isPainting)}>
          <i className="fas fa-paint-brush"></i>
        </button>
        <button className="btn button" id="isErase" onClick={this.setIsErasing} style={this.getStyle(isErasing)}>
          <i className="fas fa-eraser"></i>
        </button>
      </div>
    );
  }
}
