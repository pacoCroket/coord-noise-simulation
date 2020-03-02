import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import About from "./components/layout/About";
import Workspace from "./components/workspace/Workspace";
import "bootstrap/dist/css/bootstrap.min.css";
import leds from "./data/ledsData";
import * as firebase from "firebase";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SingIn from "./components/auth/SingIn";
import SingUp from "./components/auth/SingUp";

class App extends Component {
  constructor() {
    super();

    this.state = {
      backImg: {
        imgUrl: "https://via.placeholder.com/900x500",
        imgSize: { width: 900, height: 500 },
        imgPos: { imgX: 0, imgY: 0 }
      },
      tooling: {
        paintMode: App.paintModes.paint,
        outputScaling: 255
      },
      displayProps: {
        ledSize: 50,
        workspaceSize: { width: 800, height: 600 }
      },
      leds: leds
    };
  }

  static paintModes = {
    paint: "paint",
    line: "line",
    erase: "erase"
  };

  componentDidMount = () => {
    // const rootRef = firebase
    //   .database()
    //   .ref()
    //   .child("react");
  };

  onImgAdded = imgUrl => {
    this.setState(prevState => {
      prevState.backImg.imgUrl = imgUrl;
      return prevState;
    });
  };

  onImgLoaded = img => {
    this.setState(prevState => {
      let { width, height } = img;
      const paintAreaWidth = document.getElementById("paintArea").getBoundingClientRect().width;
      const paintAreaHeight = document.getElementById("paintArea").getBoundingClientRect().height;

      width = width > paintAreaWidth ? paintAreaWidth : width;
      height = height > paintAreaHeight ? paintAreaHeight : height;

      // constrain
      prevState.backImg.imgSize = { width, height };
      prevState.backImg.imgPos = {
        imgX: document.getElementById("canvas").getBoundingClientRect().left,
        imgY: document.getElementById("canvas").getBoundingClientRect().top
      };
      prevState.displayProps.workspaceSize = {
        width: paintAreaWidth,
        height: paintAreaHeight
      };
      return prevState;
    });
  };

  paintModeChanged = paintMode => {
    this.setState(prevState => (prevState.tooling.paintMode = paintMode));
  };

  ledSizeChanged = ledSize => {
    this.setState(prevState => (prevState.displayProps.ledSize = ledSize));
  };

  outputScalingChanged = outputScaling => {
    this.setState(prevState => (prevState.tooling.outputScaling = outputScaling));
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
      <BrowserRouter>
        <div className="App" id="app">
          <header>
            <NavBar id="NavBar" />
          </header>
          <Switch>
            <Route
              exact
              path="/"
              component={Workspace}
              leds={this.state.leds}
              tooling={this.state.tooling}
              onImgAdded={this.onImgAdded}
              paintModeChanged={this.paintModeChanged}
              ledSizeChanged={this.ledSizeChanged}
              outputScalingChanged={this.outputScalingChanged}
              backImg={this.state.backImg}
              onImgLoaded={this.onImgLoaded}
              displayProps={this.state.displayProps}
              addLed={this.addLed}
              clickedLed={this.clickedLed}
              setLed={this.setLed}
            />
            <Route path="/about" component={About} />
            <Route path="/signin" component={SingIn} />
            <Route path="/signup" component={SingUp} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
