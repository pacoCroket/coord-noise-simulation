import React, { Component } from "react";
import Nav from 'react-bootstrap/Nav'
import NavDropdown from "react-bootstrap/NavDropdown";

export default class SignedOutLinks extends Component {
  render() {
    return (
      <Nav className="ml-auto">
        <Nav.Link href="/">Home</Nav.Link>
        <Nav.Link href="/about">About</Nav.Link>
        <Nav.Link href="/signup">Sign Up</Nav.Link>
        <Nav.Link href="/login">Log In</Nav.Link>
      </Nav>
    );
  }
}
