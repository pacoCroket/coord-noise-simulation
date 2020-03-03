import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { createProject } from "../../store/actions/projectActions";
import { Redirect } from "react-router-dom";

class NewProject extends Component {
  state = { title: "", description: "" };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.createProject(this.state);
    this.props.history.push("/project");
  };

  render() {
    const { auth } = this.props;
    if (!auth.uid) return <Redirect to="/signin" />;

    return (
      <div className="container my-5 w-50">
        <Form onSubmit={this.handleSubmit}>
          <h5>New Project</h5>
          <Form.Group>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter project title"
              name="title"
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              placeholder="Description"
              name="description"
              onChange={this.handleChange}
            />
          </Form.Group>

          {/* <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}

          <Button variant="primary" type="submit">
            Add Project
          </Button>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProject: project => dispatch(createProject(project))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NewProject);
