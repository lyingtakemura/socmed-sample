import React from "react";
import { Link } from "react-router-dom";

class HomePage extends React.Component {
  render() {
    return (
      <>
        <main>
          <h2>homepage!</h2>
        </main>
        <nav>
          <Link to="/about">About</Link>
        </nav>
      </>
    );
  }
}

export default HomePage;