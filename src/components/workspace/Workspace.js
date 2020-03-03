import React, { Component } from "react";
import EditTools from "./EditTools";
import Canvas from "./Canvas";
import { connect } from "react-redux";
import Utils from "../../Utils";

class Workspace extends Component {
  state = {
    paintMode: Utils.paintModes.paint,
    ledSize: 50
  };

  onImgAdded = imgUrl => {
    const { imgSize, imgPos } = this.props.backImg;
    const backImg = {
      imgUrl,
      imgSize,
      imgPos
    };
    this.props.addImg(backImg);
  };

  onImgLoaded = img => {
    const { imgUrl } = this.props.backImg;
    let { width, height } = img;
    const paintAreaWidth = document.getElementById("paintArea").getBoundingClientRect().width;
    const paintAreaHeight = document.getElementById("paintArea").getBoundingClientRect().height;

    width = width > paintAreaWidth ? paintAreaWidth : width;
    height = height > paintAreaHeight ? paintAreaHeight : height;

    let backImg = {
      imgUrl,
      imgSize: { width, height },
      imgPos: {
        imgX: document.getElementById("canvas").getBoundingClientRect().left,
        imgY: document.getElementById("canvas").getBoundingClientRect().top
      }
    };

    this.props.addImg(backImg);

    // OLD
    // this.setState(prevState => {
    //   let { width, height } = img;
    //   const paintAreaWidth = document.getElementById("paintArea").getBoundingClientRect().width;
    //   const paintAreaHeight = document.getElementById("paintArea").getBoundingClientRect().height;

    //   width = width > paintAreaWidth ? paintAreaWidth : width;
    //   height = height > paintAreaHeight ? paintAreaHeight : height;

    //   // constrain
    //   prevState.backImg.imgSize = { width, height };
    //   prevState.backImg.imgPos = {
    //     imgX: document.getElementById("canvas").getBoundingClientRect().left,
    //     imgY: document.getElementById("canvas").getBoundingClientRect().top
    //   };
    //   prevState.displayProps.workspaceSize = {
    //     width: paintAreaWidth,
    //     height: paintAreaHeight
    //   };
    //   return prevState;
    // });
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
      this.props.deleteLed(led);
    }
  };

  render() {
    const { leds, backImg } = this.props;
    const { paintMode, ledSize } = this.state;

    // return <h2> In Progress</h2>;
    return (
      <div className="workspace">
        <div className="row noSel mw-100 h-100 mx-0 ">
          <div className="col-md-auto px-4">
            <EditTools
              leds={leds}
              paintMode={paintMode}
              ledSize={ledSize}
              imgSize={backImg.imgSize}
              onImgAdded={this.onImgAdded}
              paintModeChanged={this.paintModeChanged}
              ledSizeChanged={this.ledSizeChanged}
              outputScalingChanged={this.outputScalingChanged}
            ></EditTools>
          </div>
          {/* TODO vertical divider */}
          <div className="col-1 p-0">
            <h4>{this.props.title}</h4>
          </div>
          <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
            <Canvas
              leds={leds}
              paintMode={paintMode}
              ledSize={ledSize}
              backImg={backImg}
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
  return {
    leds: state.project.leds,
    backImg: state.project.backImg,
    title: state.project.title
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addImg: backImg => dispatch({ type: "ADD_IMG", backImg }),
    addLed: led => dispatch({ type: "ADD_LED", led }),
    deleteLed: led => dispatch({ type: "DEL_LED", led })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
