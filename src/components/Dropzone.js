import React, { Component } from "react";

export default class Dropzone extends Component {
  constructor(props) {
    super(props);
    this.fileInputRef = React.createRef();
  }

  openFileDialog = () => {
    if (this.props.disabled) return;
    this.fileInputRef.current.click();
  };

  onFilesAdded = evt => {
    if (this.props.disabled) return;
    const img = evt.target.files.item(0);
    this.props.onImgAdded(img);

    var reader = new FileReader();
    console.log(reader);
    reader.onload = e => {
      document.getElementById("canvas").src = e.target.result;
    };
    reader.readAsDataURL(img);
  };

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
