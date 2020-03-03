import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";

class NavBar extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-md navbar-light bg-faded">
        {/* Brand */}
        <a
          className="navbar-brand mr-5"
          href="https://github.com/pacoCroket/coord-noise-simulation"
          target="_blank"
          rel="noopener noreferrer"
        >
          By Paco Croket
        </a>
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2" id="navbarSupportedContent">
          {/* start items */}
          <ul className="navbar-nav mr-auto">
            {/* Project dropdown */}
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
                Project
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink to="/project" className="dropdown-item">
                  Current Project
                </NavLink>
                <NavLink to="/newproject" className="dropdown-item">
                  New Project
                </NavLink>
                <a className="dropdown-item" href="#">
                  Load
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Export
                </a>
              </div>
            </li>

            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Center */}
        {/* TODO make really in center of window */}
        <div className="mx-auto order-0">
          <a
            className="navbar-brand mx-auto"
            href="https://github.com/pacoCroket/coord-noise-simulation"
            target="_blank"
            rel="noopener noreferrer"
          >
            Noise2LED
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Right */}
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarSupportedContent">
          {/* start items */}
          <SignedInLinks />
          <SignedOutLinks />
          {/* <ul className="navbar-nav ml-auto">
            <li className="nav-item user-profile">
              <a className="nav-link" href="#">
                User Profile
              </a>
            </li>
          </ul> */}
        </div>
      </div>
    );
  }
}

export default NavBar;
