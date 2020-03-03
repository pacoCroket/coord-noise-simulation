import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

class SignedInLinks extends Component {
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

            <a onClick={this.props.signOut}  to="/" className="dropdown-item">
              Log Out
            </a>

          </div>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);