import React, { Component } from "react";
import "./App.css";
import NavBar from "./components/layout/NavBar";
import About from "./components/layout/About";
import Workspace from "./components/workspace/Workspace";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import SingIn from "./components/auth/SignIn";
import SingUp from "./components/auth/SignUp";
import NewProject from "./components/layout/NewProject";

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App" id="app">
          <header>
            <NavBar id="NavBar" />
          </header>
          <Switch>
            <Route exact path="/" component={Workspace}/>
            <Route path="/project" component={Workspace}/>
            <Route path="/newproject" component={NewProject} />
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
