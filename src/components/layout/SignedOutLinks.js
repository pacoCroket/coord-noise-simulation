import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class SignedOutLinks extends Component {
  render() {
    return (
      <ul className="navbar-nav ml-auto mr-5">
        <li className="nav-item">
          <NavLink to="/signup" className="nav-link">
            Sing Up
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/signin" className="nav-link">
            Log In
          </NavLink>
        </li>
      </ul>
    );
  }
}
