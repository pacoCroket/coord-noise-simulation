import React, { Component } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { signIn } from "../../store/actions/authActions";
import { Alert } from "react-bootstrap";
import { Redirect } from "react-router-dom";

class SignIn extends Component {
  state = { email: "", password: "" };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.signIn(this.state);
  };

  render() {
    const { authError, auth } = this.props;    
    if (auth.uid) return <Redirect to="/project/last" />;

    return (
      <div className="signIn my-5 w-50">
        <Form onSubmit={this.handleSubmit}>
          <h5>Log In</h5>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              name="password"
              onChange={this.handleChange}
            />
          </Form.Group>

          {/* <Form.Group controlId="formBasicCheckbox">
            <Form.Check type="checkbox" label="Check me out" />
          </Form.Group> */}

          {authError ? <Alert variant={"warning"}>{authError}</Alert> : null}

          <Button variant="primary" type="submit" className="btn btn-lg my-2">
            Log In
          </Button>
        </Form>
        <Link to="/signup" >
          <Button variant="primary" type="button" className="btn my-2">
            Go to Sign Up Page
          </Button>
        </Link>
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
    signIn: creds => dispatch(signIn(creds))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignIn);
