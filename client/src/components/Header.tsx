import React from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../utils/auth.js";
import { UserContextType, useCurrentUser } from "../utils/context.js";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/header.css";

const Header = () => {
  const navigate = useNavigate();
  
  const { currentUser, setCurrentUser } = useCurrentUser() as UserContextType;

  const handleLogout = () => {
    AuthService.logout(setCurrentUser);
    navigate("/login");
  }
  
  return (
    <Navbar id="header-container">
      <Navbar.Brand href="/" id="nav-title" title="Home">Notebook</Navbar.Brand>
      <Nav>
        {currentUser ? (
          <Nav.Link id="nav-logout" title="Logout" onClick={handleLogout}>Logout</Nav.Link>
        ) : (
          <Nav.Link id="nav-login" title="Login" href="/login">Login</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;
