import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchLogin } from '../api/userAPI.js';
import AuthService from '../utils/auth.js';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
  const navigate = useNavigate();

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
      if (tokenData.error) {
        setErrorMessage(tokenData.error);
        return;
      }
      AuthService.login(tokenData.token);
      navigate("/");
    } catch (error) {
      setErrorMessage("Error loggin in :" + error);
    }
  };

  return (
    <Form
      id="login-form"
      onSubmit={handleFormSubmit}>
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
      <Button type="submit"><svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg></Button>
    </Form>
  );
};

export default Login;
