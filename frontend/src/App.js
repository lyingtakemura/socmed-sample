import React from "react";
import "./App.css";
import 'rsuite/dist/rsuite.min.css';
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"

import { Routes, Route, Outlet } from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent";


const App = () => (
  <Routes>
    <Route path="/" element={<LayoutsWithNavbar />}>
      <Route path="login" element={<LoginPage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="/" element={<HomePage />} />
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
