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
import {
  uploadImg,
  addLed,
  setLed,
  delLed,
  setLocalProject,
  updateProject
} from "../../store/actions/projectActions";

class Workspace extends Component {
  state = {
    paintMode: Utils.paintModes.paint,
    ledSize: 50,
    imgSize: { width: 0, height: 0 },
    imgPos: { imgX: 0, imgY: 0 }
  };

  handleSetProject = project => {
    if (project) {
      this.props.setLocalProject(project);
    } else if (!isEmpty(this.props.projects)) {
      this.props.setLocalProject(this.props.projects[0]);
    }
  };

  handleUpdateProject = () => {
    this.props.updateProject();
  };

  handleUploadImage = imgFile => {
    this.props.uploadImg(imgFile);
  };

  updateImageDimensions = () => {
    const canvas = document.getElementById("canvas");
    const paintArea = document.getElementById("paintArea");

    let canvasWidth = canvas.clientWidth;
    let canvasHeight = canvas.clientHeight;
    const paintAreaWidth = paintArea.clientWidth;
    const paintAreaHeight = paintArea.clientHeight;

    canvasWidth = canvasWidth > paintAreaWidth ? paintAreaWidth : canvasWidth;
    canvasHeight = canvasHeight > paintAreaHeight ? paintAreaHeight : canvasHeight;
    const imgPos = {
      imgX: canvas.getBoundingClientRect().left,
      imgY: canvas.getBoundingClientRect().top
    };

    this.setState({
      imgSize: { width: canvasWidth, height: canvasHeight },
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

  addLed = led => {
    // do nothing if paintMode == 'erase'
    if (this.state.paintMode === Utils.paintModes.erase) return;
    this.props.addLed(led);
  };

  setLed = led => {
    if (this.state.paintMode !== Utils.paintModes.erase) {
      this.props.setLed(led);
    }
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

    if (!isEmpty(this.props.projects) && this.props.match.params.id === "last") {
      const project = this.props.projects[0];
      this.handleSetProject(project);
      return <Redirect to={"/project/" + project.id} />;
    }

    // loading if not local project
    if (isEmpty(this.props.localProject))
      return (
        <div className="d-flex justify-content-center align-items-center h-75">
          <Spinner animation="border" />
        </div>
      );

    const { leds, imgURL, description, createdAt } = this.props.localProject;
    const { lastEdit } = this.props.onlineProject;
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
          <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
            <Canvas
              leds={leds}
              imgURL={imgURL}
              paintMode={paintMode}
              ledSize={ledSize}
              imgSize={imgSize}
              imgPos={imgPos}
              addLed={this.addLed}
              setLed={this.setLed}
              clickedLed={this.clickedLed}
              updateImageDimensions={this.updateImageDimensions}
              onImgLoaded={this.onImgLoaded}
              clickedLed={this.clickedLed}
            ></Canvas>
          </div>
          <div className="col-lg-1 col-md-2 col-sm-3 col-xs-4 p-1 m-2 d-flex flex-column justify-content-center text-light">
            <p className="project-info">
              <span className="font-weight-bold">Description:</span>
              <br />
              {description}
            </p>
            <p className="project-info">
              <span className="font-weight-bold">Updated:</span>
              <br />
              {lastEdit && moment(lastEdit.toDate()).calendar()}
            </p>
            <p className="project-info">
              <span className="font-weight-bold">Created:</span>
              <br />
              {moment(createdAt.toDate()).calendar()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { data, ordered } = state.firestore;
  const onlineProject = data.projects && (id === "last" ? ordered[0] : data.projects[id]);
  const localProject = state.project.localProject;
  return {
    onlineProject,
    localProject,
    projects: ordered.projects,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setLocalProject: project => dispatch({ type: "SET_LOCAL_PROJECT", project }),
    uploadImg: imgFile => dispatch(uploadImg(imgFile)),
    updateProject: () => dispatch(updateProject()),
    addLed: led => dispatch({ type: "ADD_LED", led }),
    setLed: led => dispatch({ type: "SET_LED", led }),
    delLed: led => dispatch({ type: "DEL_LED", led })
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Workspace);
