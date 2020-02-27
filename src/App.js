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
        x: 250,
        y: 35
      }
    ]
  };

  render() {
    return (
      <div className="App">
        <NavBar id="NavBar"></NavBar>
        <header className="App-header">
          <div className="container workspace mr-auto">
            {/* TODO snap workspace to bottom */}
            <div className="row mx-1"> 
              <div className="col-md-auto p-0">
                <EditTools tooling={this.state.tooling}></EditTools>
              </div>
              {/* TODO vertical divider */}
              <div className="col p-0">
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
