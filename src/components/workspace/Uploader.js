import React, { Component } from "react";
import { connect } from "react-redux";
import Dropzone from "react-dropzone";
import { uploadImg } from "../../store/actions/projectActions";

class Uploader extends Component {
  constructor() {
    super();
  }
  //   const firebase = useFirebase()
  //   const uploadedFiles = useSelector(({ firebase: { data } }) => data[filesPath])

  onFilesDrop = files => {
    console.log(files);
    // this.props.uploadImg(files);
  };

  onFileDelete = (file, key) => {
    // return firebase.deleteFile(file.fullPath, `${filesPath}/${key}`);
  };

  render() {
    try {
      return (
        <div className="Dropzone">
          <i className="fas fa-file-upload"></i>
          <Dropzone onDrop={this.onFilesDrop}>
            <div>Drag and drop files here or click to select</div>
          </Dropzone>
          {/* {uploadedFiles && (
          <div>
            <h3>Uploaded image:</h3>
            {uploadedFiles.map((file, key) => (
              <div key={file.name + key}>
                <span>{file.name}</span>
                <button onClick={() => this.onFileDelete(file, key)}>Delete File</button>
              </div>
            ))}
          </div>
        )} */}
        </div>
      );
    } catch (err) {
      console.log(err);
      return <div>Error! {err.message}</div>
    }
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImg: img => dispatch(uploadImg(img))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Uploader);
