import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default class SingUp extends Component {
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
    }
    console.log(e);
  };

  render() {
    return (
      <div className="container my-5 w-50">
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

          {this.state.error?<h3>Passwords don't match!</h3>:""}

        </Form>
      </div>
    );
  }
}
