import React, { useEffect } from "react";
import "./css/App.css";
import "rsuite/dist/rsuite.min.css";
import Feed from "./pages/Feed";
import Messenger from "./pages/Messenger";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";

import { Routes, Route, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

import NavbarComponent from "./components/NavbarComponent";

const App = () => {
    let currentUser = useSelector((state) => state.users.currentUser);
    const ws = new WebSocket(
        "ws://127.0.0.1:8000/ws/test/?token=" + currentUser.token
    );

    useEffect(() => {
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
    }, []); // without second param useEffect will stuck in update loop

    return (
        <Routes>
            <Route path="/" element={<LayoutsWithNavbar />}>
                <Route path="/" element={<Feed />} />
                <Route path="messenger" element={<Messenger ws={ws} />} />
                <Route path="login" element={<LoginPage />} />
                <Route path="about" element={<AboutPage />} />
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
