import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./pages/HomePage"
import AboutPage from "./pages/AboutPage"

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
      <React.Fragment>
        <h1>Welcome to React Router!</h1>
        <h1>CURRENTLY USER AUTH IS {String(this.state.isAuth)}</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
        </Routes>
      </React.Fragment>
    )
  }
}

export default App;
