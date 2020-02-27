import React, { Component } from "react";

export default class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  openFileDialog = () => {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  }

  onFilesAdded = (evt) => {
    if (this.props.disabled) return;
    const files = evt.target.files;
    if (this.props.onFilesAdded) {
      console.log(files.item(0));
      
    }
  }

  render() {
    return (
      <div className="Dropzone" onClick={this.openFileDialog} style={{ cursor: this.props.disabled ? "default" : "pointer" }}>
        {/* <img alt="upload" className="Icon" src="../assets/cloud_upload-24px.svg" /> */}
        <i className="fas fa-file-upload" style={{ fontSize: "2rem" }}></i>
        <input ref={this.fileInputRef} className="FileInput" type="file" onChange={this.onFilesAdded} />
      </div>
    );
  }
}
