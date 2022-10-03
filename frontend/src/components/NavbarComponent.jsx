import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../redux/usersSlice";

import { Navbar, Nav } from "rsuite";

import Feed from "../pages/Feed";
import Chat from "../pages/Chat";
import AboutPage from "../pages/AboutPage";
import LoginPage from "../pages/LoginPage";

export function NavbarComponent() {
    let currentUser = useSelector((state) => state.users.currentUser);
    const dispatch = useDispatch();

    return (
        <Navbar>
            <Navbar.Brand href="#">SOCMED-SAMPLE </Navbar.Brand>
            <Nav>
                <Nav.Item as={Link} to="/" element={<Feed />}>
                    Feed
                </Nav.Item>
                <Nav.Item as={Link} to="/chat" element={<Chat />}>
                    Chat
                </Nav.Item>
                <Nav.Item as={Link} to="/about" element={<AboutPage />}>
                    About
                </Nav.Item>
            </Nav>
            <Nav pullRight>
                {!currentUser && (
                    <Nav.Item as={Link} to="/login" element={<LoginPage />}>
                        Login
                    </Nav.Item>
                )}



                {currentUser && (
                    <>
                        <Nav.Menu title={currentUser.username}>
                            <Nav.Item href="#" onClick={() => dispatch(logout())}>
                                Logout
                            </Nav.Item>
                        </Nav.Menu>
                    </>
                )}
            </Nav>
        </Navbar>
    );
}

export default NavbarComponent;
