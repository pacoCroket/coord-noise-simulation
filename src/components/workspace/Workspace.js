import React, { Component } from 'react';
import EditTools from "./EditTools";
import Canvas from "./Canvas";

export default class Workspace extends Component {

    render() {
        console.log(this.props)
        return (<h2> In Progress</h2>)
        return (
            <div className="workspace">
            <div className="row noSel mw-100 h-100 mx-0 ">
              <div className="col-md-auto px-4">
                <EditTools
                  leds={this.props.leds}
                  tooling={this.props.tooling}
                  imgSize={this.props.backImg.imgSize}
                  onImgAdded={this.props.onImgAdded}
                  paintModeChanged={this.props.paintModeChanged}
                  ledSizeChanged={this.props.ledSizeChanged}
                  outputScalingChanged={this.props.outputScalingChanged}
                ></EditTools>
              </div>
              {/* TODO vertical divider */}
              <div className="col-1 p-0"></div>
              <div className="col p-0 canvas d-flex align-items-center paintArea" id="paintArea">
                <Canvas
                  leds={this.props.leds}
                  tooling={this.props.tooling}
                  backImg={this.props.backImg}
                  onImgLoaded={this.props.onImgLoaded}
                  displayProps={this.props.displayProps}
                  addLed={this.props.addLed}
                  clickedLed={this.props.clickedLed}
                  setLed={this.props.setLed}
                ></Canvas>
              </div>
            </div>
          </div>
        )
    }
}
