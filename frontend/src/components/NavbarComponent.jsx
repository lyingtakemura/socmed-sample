import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux'

import { logout } from '../redux/usersSlice'

import { Navbar, Nav } from 'rsuite';

import HomePage from "../pages/HomePage"
import AboutPage from "../pages/AboutPage"
import LoginPage from "../pages/LoginPage"


export function NavbarComponent() {
    const token = useSelector((state) => state.users.user.token)
    const dispatch = useDispatch();

    return (
        <Navbar>
            <Navbar.Brand href="#">SOCMED-SAMPLE </Navbar.Brand>
            <Nav>
                <Nav.Item as={Link} to="/login" element={<LoginPage />} >
                    Login
                </Nav.Item>

                <Nav.Item as={Link} to="/" element={<HomePage />}>
                    Home
                </Nav.Item>
                <Nav.Item as={Link} to="/about" element={<AboutPage />}>
                    About
                </Nav.Item>
                <Nav.Item href="#" onClick={() => dispatch(logout())}>
                    Logout
                </Nav.Item>
                <Nav.Item>TOKEN:{token}</Nav.Item>
            </Nav>
        </Navbar>
    )
}

export default NavbarComponent;
