import React from "react";
import "./css/App.css";
import 'rsuite/dist/rsuite.min.css';
import Feed from "./pages/Feed"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"

import { Routes, Route, Outlet } from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent";


const App = () => (
  <Routes>
    <Route path="/" element={<LayoutsWithNavbar />}>
      <Route path="/" element={<Feed />} />
      <Route path="login" element={<LoginPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="*" element={<h1>404</h1>} />
    </Route>
  </Routes>
)

function LayoutsWithNavbar() {
  return (
    <>
      <NavbarComponent />
      <Outlet /> 
    </>
  );
}

export default App;
