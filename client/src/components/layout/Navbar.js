import React from "react";
import { Link } from "react-router-dom";
const Navbar = () => {
  return (
    <nav className="navbar bg-dark">
      <h1>
        <Link to="/">
        <i class="fas fa-puzzle-piece"></i>DevConnector
        </Link>
        
      </h1>
      <ul>
        <li>
          <a href="#"></a>Developers
        </li>
        <li>
          <Link to="/register">Register</Link>
        </li>
        <li>
          <Link to="/login">Login </Link> 
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
