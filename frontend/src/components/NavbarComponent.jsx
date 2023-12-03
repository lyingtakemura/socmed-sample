import { React } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { logoutAction } from "../redux/authenticatedSlice";

import { LoginComponent } from "./LoginComponent";
import { MessengerComponent } from "./MessengerComponent";
import { PostsComponent } from "./PostsComponent";
import { RegisterComponent } from "./RegisterComponent";
import { UserComponent } from "./UserComponent";
import { UsersComponent } from "./UsersComponent";

export function NavbarComponent() {
    const dispatch = useDispatch();
    const authenticated = useSelector((state) => state.authenticated.user);

    return (
        <div
            className="sticky top-0 bg-gray-300 w-full font-bold p-4 flex justify-between z-50 border-b-2
         border-gray-400"
        >
            <a
                href="https://github.com/lyingtakemura/socmed-sample"
                target="_"
                className="link"
            >
                SOCMED-SAMPLE
            </a>
            {!authenticated && (
                <div className="space-x-2">
                    <Link to="/login" element={<LoginComponent />} className="link">
                        LOGIN
                    </Link>
                    <Link
                        to="/register"
                        element={<RegisterComponent />}
                        className="link"
                    >
                        REGISTER
                    </Link>
                </div>
            )}

            {authenticated && (
                <>
                    <div className="space-x-2">
                        <Link to="/" element={<PostsComponent />} className="link">
                            POSTS
                        </Link>
                        <Link
                            to="/messenger"
                            element={<MessengerComponent />}
                            className="link"
                        >
                            MESSENGER
                        </Link>
                        <Link to="/users" element={<UsersComponent />} className="link">
                            USERS
                        </Link>
                    </div>
                    <div className="space-x-2">
                        <Link
                            to={"/" + authenticated.username}
                            element={<UserComponent />}
                            className="link"
                        >
                            {authenticated.username}
                        </Link>
                        <Link
                            href="#"
                            onClick={() => dispatch(logoutAction())}
                            className="link"
                        >
                            LOGOUT
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
}
