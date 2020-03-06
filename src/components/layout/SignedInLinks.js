import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import { compose } from "redux";
import { signOut } from "../../store/actions/authActions";
import { getUserProjects, delProject, setLocalProject } from "../../store/actions/projectActions";
import { Button } from "react-bootstrap";
import { isEmpty } from "underscore";

class SignedInLinks extends Component {

  handleSetProject = project => {
    if (project) {
      this.props.setLocalProject(project);
    } else if (!isEmpty(this.props.projects)) {
      this.props.setLocalProject(this.props.projects[0]);
    } 
  };

  render() {
    const { profile, projects } = this.props;

    return (
      <div className="container-fluid px-5">
        <div
          className="navbar-collapse collapse w-100 order-3 dual-collapse2"
          id="navbarNavDropdown"
        >
          {/* start items */}
          <ul className="navbar-nav mr-auto">
            {/* Project dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdownProjects"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                Projects
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdownProjects">
                <NavLink
                  exact
                  to="/project/last"
                  onClick={() => this.handleSetProject()}
                  className="dropdown-item"
                >
                  Latest Project
                </NavLink>
                <div className="dropdown-divider"></div>
                {projects
                  ? projects.map((project, index) => (
                      <NavLink
                        key={index}
                        onClick={() => this.handleSetProject(project)}
                        to={"/project/" + project.id}
                        className="dropdown-item text-capitalize"
                      >
                        {index + 1 + " - " + project.title}
                      </NavLink>
                    ))
                  : null}
              </div>
            </li>

            <li className="nav-item">
              <NavLink to="/newproject" className="nav-link">
                New Project
              </NavLink>
            </li>
          </ul>
          {/* </div> */}
                    
          <div className="navbar-brand mx-auto order-0 text-capitalize">
            <span className="text-secondary">Current project: </span>{this.props.localProject && this.props.localProject.title}
          </div>

          {/* Right */}
          {/* <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarSupportedContent"> */}
          <ul className="navbar-nav ml-auto">
            <li className="nav-item">
              <NavLink exact to="/" className="nav-link">
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                About
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle text-capitalize"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {profile.firstName ? profile.firstName + "'s Profile" : "My profile"}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink to="/" className="dropdown-item">
                  Settings
                </NavLink>
                <div className="dropdown-divider"></div>
                <Button onClick={this.props.signOut} className="dropdown-item">
                  Log Out
                </Button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { ordered } = state.firestore;
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    projects: ordered.projects,
    localProject: state.project.localProject
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
    getUserProjects: () => dispatch(getUserProjects()),
    setLocalProject: project => dispatch({ type: "SET_LOCAL_PROJECT", project }),
    // delProject: () => dispatch(delProject())
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  firestoreConnect(props => [{ collection: `users/${props.auth.uid}/projects/`, storeAs: 'projects', limit: 10, orderBy: ["createdAt", "desc"] }])
)(SignedInLinks);
