import React, { Component } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default class SignedOutLinks extends Component {
    render() {
        return (
            <>
                <Navbar.Text className="position-absolute text-capitalize" style={{left: "50%"}}>Noise2LED</Navbar.Text>
                <Nav className="ml-auto">
                    <Nav.Link href="/">Home</Nav.Link>
                    <Nav.Link href="/about">About</Nav.Link>
                    <Nav.Link href="/signup">Sign Up</Nav.Link>
                    <Nav.Link href="/signin">Log In</Nav.Link>
                </Nav>
            </>
        );
    }
}
