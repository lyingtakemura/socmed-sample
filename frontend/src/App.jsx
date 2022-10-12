import React, { useEffect } from "react";
import "./css/App.css";
import "rsuite/dist/rsuite.min.css";
import Feed from "./pages/Feed";
import Messenger from "./pages/Messenger";
import LoginPage from "./pages/LoginPage";
import Register from "./pages/Register";
import Search from "./pages/Search";

import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import NavbarComponent from "./components/NavbarComponent";

const App = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    let ws;
    if (currentUser) {
        ws = new WebSocket(
            "ws://127.0.0.1:8000/ws/test/?token=" + currentUser.token
        );
    }

    useEffect(() => {
        if (currentUser) {
            ws.onopen = () => {
                console.log("WS_INIT");
            };

            ws.onmessage = (e) => {
                console.log(e.data);
            };

            ws.onerror = (e) => {
                console.log(e);
            };

            ws.onclose = (e) => {
                console.log(e);
            };
        }
    }, [currentUser, ws]); // without second param useEffect will stuck in update loop

    return (
        <Routes>
            <Route path="/" element={<LayoutsWithNavbar />}>
                <Route
                    path="/"
                    element={!currentUser ? <Navigate to="/login" /> : <Feed />}
                />
                <Route
                    path="messenger"
                    element={
                        !currentUser ? (
                            <Navigate to="/login" />
                        ) : (
                            <Messenger ws={ws} />
                        )
                    }
                />
                <Route
                    path="search"
                    element={
                        !currentUser ? <Navigate to="/login" /> : <Search />
                    }
                />
                <Route
                    path="login"
                    element={!currentUser ? <LoginPage /> : <Navigate to="/" />}
                />
                <Route
                    path="register"
                    element={!currentUser ? <Register /> : <Navigate to="/" />}
                />
                <Route path="*" element={<h1>404</h1>} />
            </Route>
        </Routes>
    );
};

function LayoutsWithNavbar() {
    return (
        <>
            <NavbarComponent />
            <Outlet />
        </>
    );
}

export default App;
