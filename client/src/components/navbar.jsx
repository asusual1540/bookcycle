import React, { Component } from "react";
import logo from "../images/logo.svg";

class Navbar extends Component {
  state = {};
  render() {
    return (
      <div className="navigation">
        <div className="navigation-bar">
          <div>
            <img className="logo" src={logo} alt="logo" />
          </div>
          <div className="list-menu">
            <ul>
              <li>Home</li>
              <li>Buy</li>
              <li>Sell</li>
              <li>Join</li>
              <li>About</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Navbar;
