import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../utils/userContext";

import { fetchLogin } from '../api/userAPI.js';
import AuthService from '../utils/auth.js';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
  const navigate = useNavigate();

  const user = useUserContext();

  const [loginInfo, setLoginInfo] = useState({
    username: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginInfo({
      ...loginInfo,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!loginInfo.username || !loginInfo.password) {
      setErrorMessage("Please enter a username and password");
      return;
    }
    try {
      const tokenData = await fetchLogin(loginInfo.username, loginInfo.password);
      console.log("Token data: ", tokenData);
      if (tokenData.error) {
        setErrorMessage(tokenData.error);
        return;
      }
      AuthService.login(tokenData.token, tokenData.userData);
      user.setUser({ token: tokenData.token, user: tokenData.userData, setUser: user.setUser });
      navigate("/");
    } catch (error) {
      setErrorMessage("Error loggin in :" + error);
    }
  };

  return (
    <Form onSubmit={handleFormSubmit}>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          value={loginInfo.username}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Enter password"
          value={loginInfo.password}
          onChange={handleInputChange}
        />
      </Form.Group>
      {errorMessage && <p>{errorMessage}</p>}
      <Button type="submit">Login</Button>
    </Form>
  );
};

export default Login;
