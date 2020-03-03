import React, { Component } from "react";
import { NavLink, Link } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Popover from "react-bootstrap/Popover";
import Button from "react-bootstrap/Button";

class SignedInLinks extends Component {
  render() {
    const { auth, profile } = this.props;

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
          <OverlayTrigger
            trigger="click"
            placement="bottom"
            overlay={
              <Popover id="popover-positioned-bottom">
                <Popover.Title as="h3">See you soon!</Popover.Title>
                <Popover.Content className="d-flex justify-content-center">
                  {/* <strong>Holy guacamole!</strong> Check this info. */}
                  <Button onClick={this.props.signOut} className="btn btn-primary">
                    Log Out
                  </Button>
                </Popover.Content>
              </Popover>
            }
          >
            <a className="nav-link">Log Out</a>

            {/* <Button variant="secondary">Popover on {placement}</Button> */}
          </OverlayTrigger>
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
