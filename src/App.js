import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/NavBar";
import EditTools from "./components/EditTools.js";
import Canvas from "./components/Canvas.js";
import "bootstrap/dist/css/bootstrap.min.css";
import leds from "./data/ledsData";

class App extends Component {
  static paintModes = {
    paint: "paint",
    line: "line",
    erase: "erase"
  };

  state = {
    backImg: {
      imgUrl: "https://via.placeholder.com/800x200",
      imgSize: { x: 800, y: 200 }
    },
    tooling: {
      paintMode: App.paintModes.paint
    },
    displayProps: {
      ledSize: 50
    },
    leds: leds
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

    this.setState(prevState => {
      const newLed = { id: this.state.leds.length, x, y };
      return { leds: [...prevState.leds, newLed] };
    });
  };

  setLed = led2set => {
    const {canvasWidth, canvasHeight} = Canvas.getCanvasSize();
    
    led2set.x = led2set.x < 0 ? 0 : led2set.x > canvasWidth ? canvasWidth : led2set.x;
    led2set.y = led2set.y < 0 ? 0 : led2set.y > canvasHeight ? canvasHeight : led2set.y;

    this.setState(prevState => {
      const updatedLeds = prevState.leds.map(led => {
        if (led.id === led2set.id) {
          led = led2set;
        }
        return led;
      });

      return { leds: updatedLeds };
    });
  };

  clickedLed = id => {
    // remove if on 'erase' paintMode
    if (this.state.tooling.paintMode === App.paintModes.erase) {
      this.setState(prevState => {
        const updatedLeds = prevState.leds.filter(led => led.id !== id);
        // update ID of all LEDs to maintain continuity
        updatedLeds.forEach((led, index) => {
          led.id = index;
        });
        return { leds: updatedLeds };
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
          <div className="container-fluid workspace noSel px-5 py-4">
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
