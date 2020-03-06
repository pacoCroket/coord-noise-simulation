import React, { Component } from "react";
import EditTools from "./EditTools";
import Canvas from "./Canvas";
import { connect } from "react-redux";
import { compose } from "redux";
import Utils from "../../Utils";
import { isEmpty } from "underscore";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";
import Button from "react-bootstrap/Button";
import { uploadImg, delProject, updateProject, delImage } from "../../store/actions/projectActions";

class Workspace extends Component {
  state = {
    paintMode: Utils.paintModes.paint,
    ledSize: 50,
    imgSize: { width: 0, height: 0 },
    uploading: false,
    changesSaved: false
  };

  componentDidUpdate = prevProps => {
    if (prevProps.localProject.id !== this.props.localProject.id) {
      this.updateImageDimensions();
    }

    // if (prevProps.onlineProject !== this.props.localProject) {
    //   this.setState({ changesSaved: false });
    // }

    if (
      this.props.projects &&
      prevProps.match.params.id !== this.props.match.params.id &&
      this.props.match.params.id !== "last"
    ) {
      const project = this.props.projects.find(project => project.id === this.props.match.params.id);
      this.handleSetProject(project);
    }
  };

  redirectToNewProject() {
    this.props.history.push("/newproject");
  }

  handleSetProject = project => {
    if (project) {
      this.props.setLocalProject(project);
    } else if (!isEmpty(this.props.projects)) {
      this.props.setLocalProject(this.props.projects[0]);
    }
  };

  handleDeleteProject = () => {
    this.props.delProject();
    this.props.delImage(this.props.localProject.imgFileName);
    this.props.history.push("/");
  };

  handleUpdateProject = () => {
    this.props.updateProject();
  };

  handleUploadImage = imgFile => {
    this.props.uploadImg(imgFile);
    this.setState({ uploading: true });
  };

  updateImageDimensions = () => {
    const paintArea = document.getElementById("paintArea");

    const paintAreaWidth = paintArea.clientWidth;
    const paintAreaHeight = paintArea.clientHeight;

    this.setState({
      imgSize: { width: paintAreaWidth, height: paintAreaHeight }
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

    if (isEmpty(this.props.projects)) {
      // redirect to new project if there are no projects, but consider download delay
      setTimeout(() => {
        if (isEmpty(this.props.projects)) {
          this.redirectToNewProject();
        }
      }, 500);
    } else if (this.props.match.params.id === "last") {
      const project = this.props.projects[0];
      return <Redirect to={"/project/" + project.id} />;
    }

    // loading if not local project
    if (isEmpty(this.props.localProject))
      return (
        <div className="loadSpinner">
          <Spinner animation="border" />
        </div>
      );

    const { leds, imgURL, description, createdAt } = this.props.localProject;
    const { lastEdit } = this.props.onlineProject;
    const { paintMode, ledSize, imgSize, uploading } = this.state;

    return (
      <>
        <EditTools
          leds={leds}
          paintMode={paintMode}
          ledSize={ledSize}
          imgSize={imgSize}
          handleUploadImage={this.handleUploadImage}
          paintModeChanged={this.paintModeChanged}
          ledSizeChanged={this.ledSizeChanged}
          outputScalingChanged={this.outputScalingChanged}
          handleUpdateProject={this.handleUpdateProject}
        ></EditTools>

        <Canvas
          leds={leds}
          imgURL={imgURL}
          paintMode={paintMode}
          ledSize={ledSize}
          imgSize={imgSize}
          uploading={uploading}
          addLed={this.addLed}
          setLed={this.setLed}
          clickedLed={this.clickedLed}
          handleUploadImage={this.handleUploadImage}
          updateImageDimensions={this.updateImageDimensions}
          onImgLoaded={this.onImgLoaded}
        ></Canvas>

        <div className="sidebar">
          <p className="project-info">
            <span className="font-weight-bold">Description:</span>
            <br />
            {description}
          </p>
          <p className="project-info">
            <span className="font-weight-bold">Last save:</span>
            <br />
            {!isEmpty(lastEdit) && moment(lastEdit.toDate()).calendar()}
          </p>
          <p className="project-info">
            <span className="font-weight-bold">Created:</span>
            <br />
            {!isEmpty(createdAt) && moment(createdAt.toDate()).calendar()}
          </p>
          <OverlayTrigger
            key="bottom"
            trigger="click"
            placement="bottom"
            overlay={
              <Popover>
                <Popover.Content>
                  <Button
                    className="btn btn-secondary w-auto mx-auto my-3"
                    onClick={this.handleDeleteProject}
                  >
                    Sure?
                  </Button>
                </Popover.Content>
              </Popover>
            }
          >
            <Button className="btn btn-primary w-auto mx-auto my-3">Delete Project</Button>
          </OverlayTrigger>{" "}
        </div>
      </>
      // </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  const { id } = ownProps.match.params;
  const { data, ordered } = state.firestore;
  const onlineProject = data.projects && data.projects[id];
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
    delImage: imgFileName => dispatch(delImage(imgFileName)),
    updateProject: () => dispatch(updateProject()),
    delProject: () => dispatch(delProject()),
    addLed: led => dispatch({ type: "ADD_LED", led }),
    setLed: led => dispatch({ type: "SET_LED", led }),
    delLed: led => dispatch({ type: "DEL_LED", led })
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Workspace);
