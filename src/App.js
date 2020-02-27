import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import NavBar from "./components/NavBar";
import EditTools from "./components/EditTools";

class App extends Component {
  state = {
    backImg: "logo512.png",
    isPainting: true,
    isDeleting: false,
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
      }
    ]
  };

  render() {
    return (
      <div className="App">
        <NavBar></NavBar>
        <header className="App-header">
          <div className="container workspace">
            <div className="row">
              <div className="col-2">
                <EditTools></EditTools>
              </div>
              <div className="col-10 canvas">
                <img src={logo} className="App-logo" alt="logo" />
              </div>
            </div>
          </div>
        </header>
      </div>
    );
  }
}

export default App;
