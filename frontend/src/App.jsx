import React, { useEffect } from "react";
import "./css/App.css";
import "./css/index.css";

import { Home } from "./pages/Home";
import { Messenger } from "./pages/Messenger";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Users } from "./pages/Users";
import { User } from "./pages/User";

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { NavbarComponent } from "./components/NavbarComponent";

export function App() {
    let authenticated = useSelector((state) => state.users.currentUser);
    let ws;
    // console.log(window.location.hostname);
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

            // ws.onmessage = (e) => {
            //     console.log(e.data);
            // };

            // ws.onerror = (e) => {
            //     console.log(e);
            // };

            // ws.onclose = (e) => {
            //     console.log(e);
            // };
        }
    }, [authenticated, ws]); // without second param useEffect will stuck in update loop

    return (
        <Routes>
            <Route path="/" element={<LayoutsWithNavbar />}>
                <Route
                    path="/"
                    element={
                        !authenticated ? <Navigate to="/login" /> : <Home />
                    }
                />
                <Route
                    path="messenger"
                    element={
                        !authenticated ? (
                            <Navigate to="/login" />
                        ) : (
                            <Messenger ws={ws} />
                        )
                    }
                />
                <Route
                    path="users"
                    element={
                        !authenticated ? <Navigate to="/login" /> : <Users />
                    }
                />
                <Route
                    path="login"
                    element={!authenticated ? <Login /> : <Navigate to="/" />}
                />
                <Route
                    path="register"
                    element={
                        !authenticated ? <Register /> : <Navigate to="/" />
                    }
                />

                <Route
                    path=":username"
                    element={authenticated ? <User /> : <Navigate to="/" />}
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
