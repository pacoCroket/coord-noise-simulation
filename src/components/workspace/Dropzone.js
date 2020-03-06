import React, { Component } from "react";

class Dropzone extends Component {
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
    const imgFile = evt.target.files.item(0);
    this.props.handleUploadImage(imgFile);
  };

  render() {
    return (
      <div
        className="Dropzone"
        onClick={this.openFileDialog}
        style={{ cursor: this.props.disabled ? "default" : "pointer" }}
      >
        <i className="fas fa-file-upload"></i>
        <input ref={this.fileInputRef} className="FileInput" type="file" onChange={this.onFilesAdded} />
      </div>
    );
  }
}

export default Dropzone;
