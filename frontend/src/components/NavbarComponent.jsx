import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logout } from "../redux/usersSlice";

import Home from "../pages/Home";
import Messenger from "../pages/Messenger";
import LoginPage from "../pages/LoginPage";
import Register from "../pages/Register";
import Search from "../pages/Search";
import User from "../pages/User";

// import { UserIcon, ChatBubbleBottomCenterTextIcon } from "@heroicons/react/24/outline";

export function NavbarComponent() {
    let currentUser = useSelector((state) => state.users.currentUser);
    const dispatch = useDispatch();

    return (
        <div className="sticky top-0 bg-gray-300 w-auto font-bold p-4 flex justify-between z-50 mb-2">
            <div className="text-black">SOCMED-SAMPLE</div>
            {!currentUser && (
                <div className="space-x-2">
                    <Link
                        to="/login"
                        element={<LoginPage />}
                        className="text-black hover:text-green-500 hover:no-underline focus:text-green-500 focus:no-underline"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        element={<Register />}
                        className="text-black hover:text-green-500 hover:no-underline focus:text-green-500 focus:no-underline"
                    >
                        Register
                    </Link>
                </div>
            )}

            {currentUser && (
                <>
                    <div className="space-x-2">
                        <Link
                            to="/"
                            element={<Home />}
                            className="text-black hover:text-gray-300 hover:no-underline"
                        >
                            Home
                        </Link>
                        <Link
                            to="/messenger"
                            element={<Messenger />}
                            className="text-black hover:text-gray-300 hover:no-underline"
                        >
                            Messenger
                        </Link>
                        <Link
                            to="/search"
                            element={<Search />}
                            className="text-black hover:text-gray-300 hover:no-underline"
                        >
                            Search
                        </Link>
                    </div>

                    <div className="space-x-2">
                        <Link
                            to={"/" + currentUser.username}
                            element={<User />}
                            className="text-black hover:text-gray-300 hover:no-underline"
                        >
                            {currentUser.username}
                        </Link>
                        <Link
                            href="#"
                            onClick={() => dispatch(logout())}
                            className="text-black hover:text-gray-300 hover:no-underline"
                        >
                            Logout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}

export default NavbarComponent;
