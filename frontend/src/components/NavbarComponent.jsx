import { React } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { logoutAction } from "../redux/authenticatedSlice";

import { PostsComponent } from "./PostsComponent";
import { MessengerComponent } from "./MessengerComponent";
import { LoginComponent } from "./LoginComponent";
import { RegisterComponent } from "./RegisterComponent";
import { UsersComponent } from "./UsersComponent";
import { UserComponent } from "./UserComponent";

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
                        element={<LoginComponent />}
                        className="text-black hover:text-green-500/20 hover:no-underline
                         focus:text-green-500/20 focus:no-underline"
                    >
                        Login
                    </Link>
                    <Link
                        to="/register"
                        element={<RegisterComponent />}
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
                            element={<PostsComponent />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                            focus:text-green-500/20 focus:no-underline"
                        >
                            Posts
                        </Link>
                        <Link
                            to="/messenger"
                            element={<MessengerComponent />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                            focus:text-green-500/20 focus:no-underline"
                        >
                            Messenger
                        </Link>
                        <Link
                            to="/users"
                            element={<UsersComponent />}
                            className="text-black hover:text-green-500/20 hover:no-underline
                             focus:text-green-500/20 focus:no-underline"
                        >
                            Users
                        </Link>
                    </div>
                    <div className="space-x-2">
                        <Link
                            to={"/" + authenticated.username}
                            element={<UserComponent />}
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
