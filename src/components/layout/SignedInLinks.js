import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { signOut } from "../../store/actions/authActions";
import { getUserProjects, delProject } from "../../store/actions/projectActions";

class SignedInLinks extends Component {
  componentDidMount = () => {
    this.props.getUserProjects();
  };

  delProject = () => {
    this.props.delProject(this.props.projectId);
  }

  render() {
    const { profile, projects } = this.props;

    return (
      <div className="container-fluid">
        <div
          className="container-fluid navbar-collapse collapse w-100 order-1 order-md-0 dual-collapse2"
          id="navbarSupportedContent"
        >
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
                Projects
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink exact to="/project/last" className="dropdown-item">
                  Latest Project
                </NavLink>
                <div className="dropdown-divider"></div>
                {projects
                  ? projects.map((project, index) => (
                      <NavLink key={index} to={"/project/" + project.id} className="dropdown-item">
                        {index+1 + " - " + project.title}
                      </NavLink>
                    ))
                  : null}
                <div className="dropdown-divider"></div>
                <a onClick={this.delProject} className="dropdown-item">
                  Delete this Project
                </a>
              </div>
            </li>

            <li className="nav-item">
              <NavLink to="/newproject" className="nav-link">
                New Project
              </NavLink>
            </li>
          </ul>
          {/* </div> */}

          {/* Right */}
          {/* <div className="navbar-collapse collapse w-100 order-3 dual-collapse2" id="navbarSupportedContent"> */}
          <ul className="navbar-nav ml-auto mr-5">
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
                className="nav-link dropdown-toggle"
                href="#"
                id="navbarDropdown"
                role="button"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {profile.initials ? profile.initials.toUpperCase() + " Profile" : "My profile"}
              </a>
              <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                <NavLink to="/" className="dropdown-item">
                  Settings
                </NavLink>
                <div className="dropdown-divider"></div>
                <a onClick={this.props.signOut} className="dropdown-item">
                  Log Out
                </a>
              </div>
            </li>

            {/* <li className="nav-item">
              <OverlayTrigger
                trigger="click"
                placement="bottom"
                overlay={
                  <Popover id="popover-positioned-bottom">
                    <Popover.Title as="h3">See you soon!</Popover.Title>
                    <Popover.Content className="d-flex justify-content-center">
                      <Button onClick={this.props.signOut} className="btn btn-primary">
                        Log Out
                      </Button>
                    </Popover.Content>
                  </Popover>
                }
              >
                <a className="nav-link">Log Out</a>

              </OverlayTrigger>
            </li> */}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth,
    profile: state.firebase.profile,
    projects: state.project.projects,
    projectId: state.project.id
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signOut: () => dispatch(signOut()),
    getUserProjects: () => dispatch(getUserProjects()),
    delProject: (projectId) => dispatch(delProject(projectId))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignedInLinks);
