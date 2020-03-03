import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";

class SignedInLinks extends Component {
  render() {
    const {auth, profile} = this.props;

    return (
      <ul className="navbar-nav ml-auto mr-5">
        <li className="nav-item">
          <NavLink to="/newproject" className="nav-link">
            New Project
          </NavLink>
        </li>
        <li className="nav-item">
          <Link to="/" className="nav-link">
            {profile.initials ? profile.initials.toUpperCase() + " Profile" : "My profile"}
          </Link>
        </li>
        <li className="nav-item">
          <Link onClick={this.props.signOut} to="/" className="nav-link">
            Log Out
          </Link>
        </li>
      </ul>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut())
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
