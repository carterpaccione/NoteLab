import React, { useEffect } from "react";
import { useUserContext } from "../utils/userContext";
import AuthService from "../utils/auth.js";

import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "../styles/header.css";

const Header = () => {
  const user = useUserContext();

  const ButtonStatus = () => {
    if (user.token) {
      return (
        <Nav.Link
          href="/login"
          onClick={() => {
            AuthService.logout();
            user.setUser({ token: null, user: null, setUser: user.setUser });
          }}
        >
          Logout
        </Nav.Link>
      );
    } else {
      return <Nav.Link href="/login">Login</Nav.Link>;
    }
  };

  useEffect(() => {
    ButtonStatus();
  });

  return (
    <Navbar id="header-container">
      <Navbar.Brand href="/">My App</Navbar.Brand>
      <Nav>
        {ButtonStatus()}
      </Nav>
    </Navbar>
  );
};

export default Header;
