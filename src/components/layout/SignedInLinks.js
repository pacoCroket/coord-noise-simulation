import React, { Component } from "react";
import { NavLink } from "react-router-dom";

export default class SignedInLinks extends Component {
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
            <NavLink to="/newproject" className="dropdown-item">
              New Project
            </NavLink>

            <NavLink to="/" className="dropdown-item">
              Log Out
            </NavLink>

          </div>
        </li>
      </ul>
    );
  }
}