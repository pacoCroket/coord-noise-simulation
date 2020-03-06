import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { connect } from "react-redux";
import { signUp } from "../../store/actions/authActions";
import { Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class SingUp extends Component {
  state = { email: "", password: "", rePassword: "", firstName: "", lastName: "", error: false };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    if (this.state.password !== this.state.rePassword) {
      this.setState({ error: true });
      return;
    } else {
      this.setState({ error: false });
      this.props.signUp(this.state);
    }
    console.log(e);
  };

  render() {
    const { authError, auth } = this.props;
    if (auth.uid) return <Redirect to="/newproject" />;

    return (
      <div className="signUp my-5 w-50">
        <Form onSubmit={this.handleSubmit}>
          <h5>Sing Up</h5>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.handleChange} />
            <Form.Text className="text-muted">We'll never share your email with anyone else.</Form.Text>
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" name="password" onChange={this.handleChange} />
          </Form.Group>
          <Form.Group controlId="formBasicRePassword">
            <Form.Label>Repeat Password</Form.Label>
            <Form.Control type="password" placeholder="Repeat password" name="rePassword" onChange={this.handleChange} />
          </Form.Group>
          <Form.Group controlId="formBasicFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control type="text" placeholder="Enter first name" name="firstName" onChange={this.handleChange} />
          </Form.Group>
          <Form.Group controlId="formBasicLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control type="text" placeholder="Enter last name" name="lastName" onChange={this.handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Sing Up
          </Button>

          {this.state.error ? <h3>Passwords don't match!</h3> : null}
          {authError ? <Alert variant={"warning"}>{authError}</Alert> : null}
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authError: state.auth.authError,
    auth: state.firebase.auth
  };
};

const mapDispatchToProps = dispatch => {
  return {
    signUp: newUser => dispatch(signUp(newUser))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SingUp);
