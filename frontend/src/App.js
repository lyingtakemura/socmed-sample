import React from "react";
import "./App.css";
import 'rsuite/dist/rsuite.min.css';
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"
import LoginPage from "./pages/LoginPage"

import { Routes, Route } from "react-router-dom";

import NavbarComponent from "./components/NavbarComponent";


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuth: false
    }
  }

  componentDidMount() {
    console.log("TEST")
  }

  render() {
    return (
      <>
        <NavbarComponent />
        <React.Fragment>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="about" element={<AboutPage />} />
                <Route path="login" element={<LoginPage />} />

            </Routes>
        </React.Fragment>
      </>

    )
  }
}

export default App;
