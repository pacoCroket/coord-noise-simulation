import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class SignedOutLinks extends Component {
  render() {
    return (
      <ul className="navbar-nav ml-auto mr-5">
        <li className="nav-item dropdown">
          <a
            className="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-toggle="dropdown"
            aria-haspopup="true"
            aria-expanded="false"
          >
            Profile
          </a>
          <div className="dropdown-menu" aria-labelledby="navbarDropdown">
            <NavLink to="/signup" className="dropdown-item">
              Sing Up
            </NavLink>

            <NavLink to="/signin" className="dropdown-item">
              Log In
            </NavLink>
          </div>
        </li>
      </ul>
    );
  }
}
