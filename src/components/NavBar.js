import React, { Component } from "react";

class NavBar extends Component {
  render() {
    return (
      <div className="navbar navbar-expand-md navbar-light bg-faded">
        {/* Brand */}
        <a className="navbar-brand" href="#">
          Noise2LED
        </a>
        <div className="navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2" id="navbarSupportedContent">
          {/* start items */}
          <ul className="navbar-nav mr-auto">
            <li className="nav-item">
              <a className="nav-link" href="#">
                Project
              </a>
            </li>
            {/* Edit dropdown */}
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
                Edit
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <a className="dropdown-item" href="#">
                  Save
                </a>
                <a className="dropdown-item" href="#">
                  Load
                </a>
                <div className="dropdown-divider"></div>
                <a className="dropdown-item" href="#">
                  Export
                </a>
              </div>
            </li>
          </ul>
        </div>

        {/* Center */}
        <div class="mx-auto order-0">
          <a class="navbar-brand mx-auto" href="#">
            Paco Croket
          </a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target=".dual-collapse2">
            <span class="navbar-toggler-icon"></span>
          </button>
        </div>

        {/* Right */}
        <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarSupportedContent">
          {/* start items */}
          <ul className="navbar-nav ml-auto">
            {/* User profile */}
            <li className="nav-item user-profile">
              <a className="nav-link" href="#">
                User Profile
              </a>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default NavBar;
