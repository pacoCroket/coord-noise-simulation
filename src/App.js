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
import Utils from "./Utils";

class App extends Component {
  constructor() {
    super();

    this.state = {
      backImg: {
        imgUrl: "",
        imgSize: { width: 0, height: 0 },
        imgPos: { imgX: 0, imgY: 0 }
      },
      tooling: {
        paintMode: Utils.paintModes.paint,
        outputScaling: 255
      },
      displayProps: {
        ledSize: 50,
        workspaceSize: { width: 800, height: 600 }
      },
      leds: leds
    };
  }

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
              // leds={this.state.leds}
              // tooling={this.state.tooling}
              // onImgAdded={this.onImgAdded}
              // paintModeChanged={this.paintModeChanged}
              // ledSizeChanged={this.ledSizeChanged}
              // outputScalingChanged={this.outputScalingChanged}
              // backImg={this.state.backImg}
              // onImgLoaded={this.onImgLoaded}
              // displayProps={this.state.displayProps}
              // addLed={this.addLed}
              // clickedLed={this.clickedLed}
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
