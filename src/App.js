import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import EditTools from "./components/EditTools.js";
import Canvas from "./components/Canvas.js";
import "bootstrap/dist/css/bootstrap.min.css";

class App extends Component {
  static paintModes = {
    paint: "paint",
    line: "line",
    erase: "erase"
  };

  state = {
    backImg: {
      imgUrl: "",
      imgSize: { x: 1200, y: 600 }
    },
    tooling: {
      paintMode: App.paintModes.paint
    },
    displayProps: {
      ledSize: 50
    },
    leds: [
      {
        id: 1,
        x: 12,
        y: 34
      },
      {
        id: 2,
        x: 43,
        y: 45
      },
      {
        id: 3,
        x: 105,
        y: 15
      },
      {
        id: 4,
        x: 250,
        y: 0
      },
      {
        id: 5,
        x: 500,
        y: 300
      }
    ]
  };

  onImgAdded = img => {
    this.state.backImg = img;
    console.log(this.state.backImg);
  };

  paintModeChanged = paintMode => {
    this.state.tooling.paintMode = paintMode;
    console.log("app.js " + paintMode);
  };

  render() {
    return (
      <div className="App">
        <NavBar id="NavBar"></NavBar>
        <header className="App-header h-100">
          <div className="container-fluid workspace px-5 py-4">
            {/* TODO snap workspace to bottom */}
            <div className="row mx-auto">
              <div className="col-md-auto p-0 h-100">
                <EditTools
                  tooling={this.state.tooling}
                  onImgAdded={this.onImgAdded}
                  paintModeChanged={this.paintModeChanged}
                ></EditTools>
              </div>
              {/* TODO vertical divider */}
              <div className="col-1 p-0 h-100"></div>
              <div className="col p-0 h-100">
                <Canvas
                  leds={this.state.leds}
                  tooling={this.state.tooling}
                  backImg={this.state.backImg}
                  displayProps={this.state.displayProps}
                ></Canvas>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
