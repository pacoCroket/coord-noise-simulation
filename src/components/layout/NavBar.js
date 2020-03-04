import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import SignedInLinks from "./SignedInLinks";
import SignedOutLinks from "./SignedOutLinks";
import { connect } from "react-redux";

class NavBar extends Component {
  render() {
    const { auth, profile } = this.props;
    const links = auth.uid ? <SignedInLinks /> : <SignedOutLinks />;

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

        {/* Center TODO*/}
        {/* <div className="mx-auto order-0">
          <Link to={auth.uid ?"/project":"/"} className="navbar-brand">
            Noise2LED
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target=".dual-collapse2"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div> */}

        {auth.isLoaded && links}
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

export default connect(mapStateToProps)(NavBar);
