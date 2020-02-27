import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import EditTools from "./components/EditTools.js";
import Canvas from "./components/Canvas.js";

class App extends Component {
  state = {
    backImg: '',
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

  onImgAdded = (img) => {
    this.state.backImg = img;
    console.log(this.state.backImg)
  }


  render() {
    return (
      <div className="App">
        <NavBar id="NavBar"></NavBar>
        <header className="App-header h-100">
          <div className="container workspace mr-auto">
            {/* TODO snap workspace to bottom */}
            <div className="row mx-1"> 
              <div className="col-md-auto p-0 h-100">
                <EditTools tooling={this.state.tooling} onImgAdded={this.onImgAdded}></EditTools>
              </div>
              {/* TODO vertical divider */}
              <div className="col p-0 h-100">
                <Canvas leds={this.state.leds} tooling={this.state.tooling} img={this.state.backImg}></Canvas>
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
