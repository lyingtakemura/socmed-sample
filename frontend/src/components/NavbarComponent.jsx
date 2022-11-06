import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../redux/usersSlice";

import { Navbar, Nav, Avatar } from "rsuite";

import Home from "../pages/Home";
import Messenger from "../pages/Messenger";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import Search from "../pages/Search";
import User from "../pages/User";
import SearchIcon from "@rsuite/icons/Search";
import MessageIcon from "@rsuite/icons/Message";
import HomeIcon from "@rsuite/icons/legacy/Home";
import ExitIcon from "@rsuite/icons/Exit";
import MenuIcon from "@rsuite/icons/Menu";

export function NavbarComponent() {
    let currentUser = useSelector((state) => state.users.currentUser);
    const dispatch = useDispatch();

    return (
        <Navbar style={{ position: "sticky", top: "0", zIndex: "9999" }}>
            <Navbar.Brand href="#">SOCMED-SAMPLE </Navbar.Brand>
            {currentUser && (
                <Nav>
                    <Nav.Item
                        as={Link}
                        to="/"
                        element={<Home />}
                        icon={<HomeIcon />}
                    >
                        Home
                    </Nav.Item>
                    <Nav.Item
                        as={Link}
                        to="/messenger"
                        element={<Messenger />}
                        icon={<MessageIcon />}
                    >
                        Messenger
                    </Nav.Item>
                    <Nav.Item
                        as={Link}
                        to="/search"
                        element={<Search />}
                        icon={<SearchIcon />}
                    >
                        Search
                    </Nav.Item>
                </Nav>
            )}

            <Nav pullRight>
                {!currentUser && (
                    <>
                        <Nav.Item as={Link} to="/login" element={<LoginPage />}>
                            Login
                        </Nav.Item>
                        <Nav.Item
                            as={Link}
                            to="/register"
                            element={<Register />}
                        >
                            Register
                        </Nav.Item>
                    </>
                )}

                {currentUser && (
                    <>
                        <Nav.Item
                            as={Link}
                            to={"/" + currentUser.username}
                            element={<User />}
                            icon={
                                <Avatar
                                    size="sm"
                                    src={currentUser.image}
                                    alt="?"
                                />
                            }
                        >
                            {currentUser.username}
                        </Nav.Item>
                        <Nav.Menu title="More" icon={<MenuIcon />}>
                            <Nav.Item
                                href="#"
                                onClick={() => dispatch(logout())}
                                icon={<ExitIcon />}
                            >
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
