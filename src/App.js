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
      imgUrl: "https://via.placeholder.com/1200x200",
      imgSize: { x: 1200, y: 200 }
    },
    tooling: {
      paintMode: App.paintModes.erase
    },
    displayProps: {
      ledSize: 50
    },
    leds: [
      {
        id: 0,
        x: 800,
        y: 150
      },
      {
        id: 1,
        x: 43,
        y: 45
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

  onImgAdded = (img, imgUrl) => {
    // console.log(img);
    this.setState({
      backImg: {
        imgUrl,
        imgSize: { x: 1200, y: 200 }
      }
    });
    // document.getElementById("canvas").src = imgUrl;
  };

  paintModeChanged = paintMode => {
    this.setState({ tooling: { paintMode } });
  };

  addLed = ({ x, y }) => {
    // do nothing if paintMode == 'erase'
    if (this.state.tooling.paintMode === App.paintModes.erase) return;
    const newLed = {
      id: `${this.state.leds.length + 1}`,
      x,
      y
    };

    this.setState({ leds: [...this.state.leds, newLed] });
  };

  setLed = led2set => {
    console.log(led2set)
    this.setState({
      leds: [
        ...this.state.leds.map(led => {
          if (led.id === led2set.id) {
            led = led2set;
          }
          return led;
        })
      ]
    });
  };

  clickedLed = id => {
    // remove if on 'erase' paintMode
    if (this.state.tooling.paintMode === App.paintModes.erase) {
      this.setState({ leds: [...this.state.leds.filter(led => led.id !== id)] });
      // update ID of all LEDs to maintain continuity
      this.state.leds.forEach((led, index) => {
        led.id = index;
      });

      this.setState({
        leds: [...this.state.leds]
      });

      // return true if this LED was deleted
      return true;
    }
  };

  render() {
    return (
      <div className="App">
        <NavBar id="NavBar"></NavBar>
        <header className="App-header h-100">
          <div className="container-fluid workspace px-5 py-4">
            {/* TODO snap workspace to bottom */}
            <div className="row mx-auto">
              <div className="col-md-auto p-0">
                <EditTools
                  tooling={this.state.tooling}
                  onImgAdded={this.onImgAdded}
                  paintModeChanged={this.paintModeChanged}
                ></EditTools>
              </div>
              {/* TODO vertical divider */}
              <div className="col-1 p-0"></div>
              <div className="col p-0 my-auto">
                <Canvas
                  leds={this.state.leds}
                  tooling={this.state.tooling}
                  backImg={this.state.backImg}
                  displayProps={this.state.displayProps}
                  addLed={this.addLed}
                  clickedLed={this.clickedLed}
                  setLed={this.setLed}
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
