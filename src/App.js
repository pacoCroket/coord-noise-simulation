import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import EditTools from "./components/EditTools.js";
import Canvas from "./components/Canvas.js";

class App extends Component {
  state = {
    backImg: "logo512.png",
    tooling: {
      isPainting: true,
      isErasing: false
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
        x: 180,
        y: 35
      }
    ]
  };

  render() {
    return (
      <div className="App">
        <NavBar id="NavBar"></NavBar>
        <header className="App-header">
          <div className="container workspace mx-auto">
            {/* TODO snap workspace to bottom */}
            <div className="row" style={{height: '94vh'}}> 
              <div className="col-2">
                <EditTools tooling={this.state.tooling}></EditTools>
              </div>
              <div className="col-10 canvas">
                <Canvas leds={this.state.leds} tooling={this.state.tooling}></Canvas>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
