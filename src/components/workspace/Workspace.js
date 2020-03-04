import React, { Component } from "react";
import EditTools from "./EditTools";
import Canvas from "./Canvas";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Utils from "../../Utils";
import { compose } from "redux";
import { Redirect } from "react-router-dom";
import Spinner from "react-bootstrap/Spinner";
import { addLed, setLed, delLed, addImg } from "../../store/actions/projectActions";

class Workspace extends Component {
  state = {
    paintMode: Utils.paintModes.paint,
    ledSize: 50,
    imgSize: { width: 0, height: 0 },
    imgPos: { imgX: 0, imgY: 0 }
  };

  onImgAdded = ({ imgUrl }) => {
    this.props.addImg({ imgUrl });
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

    // loading
    if (!this.props.project)
      return (
        <div className="d-flex justify-content-center align-items-center h-75">
          <Spinner animation="border" />
        </div>
      );

    const { leds } = this.props.project;
    const { paintMode, ledSize, imgSize, imgPos } = this.state;

    // return <h2> In Progress</h2>;
    return (
      <div className="workspace">
        <div className="row noSel mw-100 h-100 mx-0 ">
          <div className="col-lg-2 col-sm-3 col-xs-4 px-4">
            <EditTools
              leds={leds}
              paintMode={paintMode}
              ledSize={ledSize}
              imgSize={imgSize}
              imgPos={imgPos}
              onImgAdded={this.onImgAdded}
              paintModeChanged={this.paintModeChanged}
              ledSizeChanged={this.ledSizeChanged}
              outputScalingChanged={this.outputScalingChanged}
            ></EditTools>
          </div>
          {/* TODO vertical divider */}
          <div className="col-1 p-0">
            <h4>{this.props.project.title}</h4>
          </div>
          <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
            <Canvas
              leds={leds}
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
  const project =
    id === "last" && state.project.projects.length>0 ? state.project.projects[0] : state.project.projects.find(project => project.id === id);
  return {
    project,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addImg: backImg => dispatch(addImg(backImg)),
    addLed: led => dispatch(addLed(led)),
    setLed: led => dispatch(setLed(led)),
    delLed: led => dispatch(delLed(led))
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect([{ collection: "projects" }])
)(Workspace);
