import React, { Component } from "react";
import EditTools from "./EditTools";
import Canvas from "./Canvas";
import { connect } from "react-redux";
import { compose } from "redux";
import Utils from "../../Utils";
import { isEmpty } from "underscore";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import { uploadImg, addLed, setLed, delLed, updateProject } from "../../store/actions/projectActions";

class Workspace extends Component {
  state = {
    paintMode: Utils.paintModes.paint,
    ledSize: 50,
    imgSize: { width: 0, height: 0 },
    imgPos: { imgX: 0, imgY: 0 },
    currentProjectId: this.props.match.params.id
  };

  handleUpdateProject = id => {
    this.setState({ currentProjectId: id });
    this.props.updateProject();
  };

  handleUploadImage = imgFile => {
    this.props.uploadImg(imgFile);
  };

  updateImageDimensions = () => {
    let { width, height } = document.getElementById("canvas");
    const paintAreaWidth = document.getElementById("paintArea").getBoundingClientRect().width;
    const paintAreaHeight = document.getElementById("paintArea").getBoundingClientRect().height;

    width = width > paintAreaWidth ? paintAreaWidth : width;
    height = height > paintAreaHeight ? paintAreaHeight : height;
    const imgPos = {
      imgX: document.getElementById("canvas").getBoundingClientRect().left,
      imgY: document.getElementById("canvas").getBoundingClientRect().top
    };

    this.setState({
      imgSize: { width, height },
      imgPos
    });
  };

  paintModeChanged = paintMode => {
    this.setState({ paintMode });
  };

  ledSizeChanged = ledSize => {
    this.setState({ ledSize });
  };

  outputScalingChanged = outputScaling => {
    this.setState({ outputScaling });
  };

  addLed = ({ x, y }) => {
    // do nothing if paintMode == 'erase'
    if (this.state.paintMode === Utils.paintModes.erase) return;
    const led = { id: this.props.leds.length, x, y };
    this.props.addLed(led);
  };

  clickedLed = led => {
    // remove if on 'erase' paintMode
    if (this.state.paintMode === Utils.paintModes.erase) {
      this.props.delLed(led);
    }
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;
    // redirect to new project
    // if (this.props.projects.length === 0) {
    //   return <Redirect to="/newproject" />;

    //   // redirect to last project
    // }

    if (!isEmpty(this.props.projects) && this.props.match.params.id === "last") {
      const project = this.props.projects[0];
      return <Redirect to={"/project/" + project.id} />;
    }

    // loading if not current project
    if (isEmpty(this.props.currentProject))
      return (
        <div className="d-flex justify-content-center align-items-center h-75">
          <Spinner animation="border" />
        </div>
      );

    const { leds, imgURL, description, createdAt } = this.props.currentProject;
    const { paintMode, ledSize, imgSize, imgPos } = this.state;

    // return <h2> In Progress</h2>;
    return (
      <div className="workspace">
        <div className="row noSel mw-100 h-100 mx-0 ">
          <div className="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-1">
            <EditTools
              leds={leds}
              paintMode={paintMode}
              ledSize={ledSize}
              imgSize={imgSize}
              imgPos={imgPos}
              handleUploadImage={this.handleUploadImage}
              paintModeChanged={this.paintModeChanged}
              ledSizeChanged={this.ledSizeChanged}
              outputScalingChanged={this.outputScalingChanged}
              handleUpdateProject={this.handleUpdateProject}
            ></EditTools>
          </div>
          {/* TODO vertical divider */}
          <div className="col-1 p-3 my-2 d-flex flex-column">
            <h5>{description}</h5>
            <h5 className="mt-auto">Created: {moment(createdAt.toDate()).calendar()}</h5>
          </div>
          <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
            <Canvas
              leds={leds}
              imgURL={imgURL}
              paintMode={paintMode}
              ledSize={ledSize}
              imgSize={imgSize}
              imgPos={imgPos}
              updateImageDimensions={this.updateImageDimensions}
              onImgLoaded={this.onImgLoaded}
              clickedLed={this.clickedLed}
            ></Canvas>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { data, ordered } = state.firestore;
  const currentProject = data.projects && (id === "last" ? ordered[0] : data.projects[id]);
  return {
    currentProject,
    projects: ordered.projects,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    uploadImg: imgFile => dispatch(uploadImg(imgFile)),
    updateProject: () => dispatch(updateProject()),
    addLed: led => dispatch(addLed(led)),
    setLed: led => dispatch(setLed(led)),
    delLed: led => dispatch(delLed(led))
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Workspace);
