import React, { Component } from "react";
import EditTools from "./EditTools";
import Canvas from "./Canvas";
import { connect } from "react-redux";
import Utils from "../../Utils";
import { addImgAction } from "../../store/actions/projectActions";

class Workspace extends Component {
  state = {
    tooling: {
      paintMode: Utils.paintModes.paint,
      outputScaling: 255,
      ledSize: 50
    }
  };

  onImgAdded = imgUrl => {
    // this.setState(prevState => {
    //   prevState.backImg.imgUrl = imgUrl;
    //   return prevState;
    // });
  };

  onImgLoaded = img => {
    let dummyBackImg = {
      imgUrl: "https://via.placeholder.com/600x600",
      imgSize: { width: 600, height: 600 },
      imgPos: { imgX: 0, imgY: 0 }
    };

    this.props.addImgAction(dummyBackImg);

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
    this.setState(prevState => (prevState.tooling.paintMode = paintMode));
  };

  ledSizeChanged = ledSize => {
    this.setState(prevState => (prevState.tooling.ledSize = ledSize));
  };

  outputScalingChanged = outputScaling => {
    this.setState(prevState => (prevState.tooling.outputScaling = outputScaling));
  };

  addLed = ({ x, y }) => {
    // do nothing if paintMode == 'erase'
    if (this.state.tooling.paintMode === Utils.paintModes.erase) return;

    // this.setState(prevState => {
    //   const newLed = { id: this.state.leds.length, x, y };
    //   return { leds: [...prevState.leds, newLed] };
    // });
  };

  setLed = led2set => {
    // this.setState(prevState => {
    //   const updatedLeds = prevState.leds.map(led => {
    //     if (led.id === led2set.id) {
    //       led = led2set;
    //     }
    //     return led;
    //   });

    //   return { leds: updatedLeds };
    // });
  };

  clickedLed = id => {
    // remove if on 'erase' paintMode
    if (this.state.tooling.paintMode === Utils.paintModes.erase) {
      // this.setState(prevState => {
      //   const updatedLeds = prevState.leds.filter(led => led.id !== id);
      //   // update ID of all LEDs to maintain continuity
      //   updatedLeds.forEach((led, index) => {
      //     led.id = index;
      //   });
      //   return { leds: updatedLeds };
      // });

      // return true if this LED was deleted
      return true;
    }
  };

  render() {
    const { leds, backImg } = this.props;
    const { tooling } = this.state;
    
    // return <h2> In Progress</h2>;
    return (
      <div className="workspace">
        <div className="row noSel mw-100 h-100 mx-0 ">
          <div className="col-md-auto px-4">
            <EditTools
              leds={leds}
              tooling={tooling}
              imgSize={backImg.imgSize}
              onImgAdded={this.onImgAdded}
              paintModeChanged={this.paintModeChanged}
              ledSizeChanged={this.ledSizeChanged}
              outputScalingChanged={this.outputScalingChanged}
            ></EditTools>
          </div>
          {/* TODO vertical divider */}
          <div className="col-1 p-0"></div>
          <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
            <Canvas
              leds={leds}
              tooling={tooling}
              backImg={backImg}
              onImgLoaded={this.onImgLoaded}
              addLed={this.addLed}
              clickedLed={this.clickedLed}
              setLed={this.setLed}
            ></Canvas>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    leds: state.project.leds,
    backImg: state.project.backImg
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addImgAction: backImg => dispatch(addImgAction(backImg))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
