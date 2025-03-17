import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../utils/auth.js";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();

  const token = AuthService.loggedIn();

  return (
    <Navbar id="header-container">
      <Navbar.Brand href="/" id="nav-title" title="Home">Notebook</Navbar.Brand>
      <Nav>
        {token ? (
          <Nav.Link id="nav-logout" title="Logout" onClick={() => { AuthService.logout(); navigate('/login'); }}>Logout</Nav.Link>
        ) : (
          <Nav.Link id="nav-login" title="Login" href="/login">Login</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
