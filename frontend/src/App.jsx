import React, { useEffect } from "react";
import "./css/App.css";
import "./css/index.css";

import { PostsComponent } from "./components/PostsComponent";
import { MessengerComponent } from "./components/MessengerComponent";
import { LoginComponent } from "./components/LoginComponent";
import { RegisterComponent } from "./components/RegisterComponent";
import { UsersComponent } from "./components/UsersComponent";
import { UserComponent } from "./components/UserComponent";

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { NavbarComponent } from "./components/NavbarComponent";

export function App() {
    let authenticated = useSelector((state) => state.authenticated.user);
    let ws;
    if (authenticated) {
        ws = new WebSocket(
            "ws://" +
                window.location.hostname +
                ":8000/ws/notifications/?token=" +
                authenticated.token,
        );
    }

    useEffect(() => {
        if (authenticated) {
            ws.onopen = () => {
                console.log("WS_NOTIFICATIONS_INIT");
            };
        }
    }, [authenticated, ws]);

    return (
        <Routes>
            <Route path="/" element={<LayoutsWithNavbar />}>
                <Route
                    path="/"
                    element={
                        !authenticated ? <Navigate to="/login" /> : <PostsComponent />
                    }
                />
                <Route
                    path="messenger"
                    element={
                        !authenticated ? (
                            <Navigate to="/login" />
                        ) : (
                            <MessengerComponent />
                        )
                    }
                />
                <Route
                    path="users"
                    element={
                        !authenticated ? <Navigate to="/login" /> : <UsersComponent />
                    }
                />
                <Route
                    path="login"
                    element={!authenticated ? <LoginComponent /> : <Navigate to="/" />}
                />
                <Route
                    path="register"
                    element={
                        !authenticated ? <RegisterComponent /> : <Navigate to="/" />
                    }
                />

                <Route
                    path=":username"
                    element={authenticated ? <UserComponent /> : <Navigate to="/" />}
                />

                <Route path="*" element={<h1>404</h1>} />
            </Route>
        </Routes>
    );
}

function LayoutsWithNavbar() {
    return (
        <div className="grid grid-cols-1 bg-gray-200 text-black overflow-hidden max-h-screen">
            <NavbarComponent />
            <div className="min-h-screen">
                <Outlet />
            </div>
        </div>
    );
}
