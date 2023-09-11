import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logoutAction } from "../redux/authenticatedSlice";

import { Home } from "../pages/Home";
import { Messenger } from "../pages/Messenger";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { Users } from "../pages/Users";
import { User } from "../pages/User";

export function NavbarComponent() {
    const authenticated = useSelector((state) => state.authenticated.user);
    const dispatch = useDispatch();

    return (
        <div
            className="sticky top-0 bg-gray-300 w-full font-bold p-4 flex justify-between z-50 border-b-2
         border-gray-400"
        >
            <a
                href="https://github.com/lyingtakemura/socmed-sample"
                target="_"
                className="text-black hover:text-green-500/20"
            >
                SOCMED-SAMPLE
            </a>
            {!authenticated && (
                <div className="space-x-2">
                    <Link
                        to="/login"
                        element={<Login />}
                        className="text-black hover:text-green-500/20 hover:no-underline
                         focus:text-green-500/20 focus:no-underline"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        element={<Register />}
                        className="text-black hover:text-green-500/20 hover:no-underline
                         focus:text-green-500/20 focus:no-underline"
                    >
                        Register
                    </Link>
                </div>
            )}

            {authenticated && (
                <>
                    <div className="space-x-2">
                        <Link
                            to="/"
                            element={<Home />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                            focus:text-green-500/20 focus:no-underline"
                        >
                            Home
                        </Link>
                        <Link
                            to="/messenger"
                            element={<Messenger />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                            focus:text-green-500/20 focus:no-underline"
                        >
                            Messenger
                        </Link>
                        <Link
                            to="/users"
                            element={<Users />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                             focus:text-green-500/20 focus:no-underline"
                        >
                            Users
                        </Link>
                    </div>

                    <div className="space-x-2">
                        <Link
                            to={"/" + authenticated.username}
                            element={<User />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                             focus:text-green-500/20 focus:no-underline"
                        >
                            {authenticated.username}
                        </Link>
                        <Link
                            href="#"
                            onClick={() => dispatch(logoutAction())}
                            className="text-black hover:text-green-500/20 hover:no-underline
                             focus:text-green-500/20 focus:no-underline"
                        >
                            Logout
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
