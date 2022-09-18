import React from "react";
import { Link } from "react-router-dom";

import { Navbar, Nav } from 'rsuite';

import HomePage from "../pages/HomePage"
import AboutPage from "../pages/AboutPage"
import LoginPage from "../pages/LoginPage"

class NavbarComponent extends React.Component {
  render() {
    return (
    <Navbar>
        <Navbar.Brand href="#">SOCMED-SAMPLE</Navbar.Brand>
        <Nav>
            <Nav.Item as={Link} to="/" element={<HomePage />}>
                Home
            </Nav.Item>
            <Nav.Item as={Link} to="/about" element={<AboutPage />}>
                About
            </Nav.Item>
            <Nav.Item as={Link} to="/login" element={<LoginPage />}>
                Login
            </Nav.Item>
        </Nav>
    </Navbar>
    )
  }
}

export default NavbarComponent;
