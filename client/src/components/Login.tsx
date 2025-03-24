import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { fetchLogin } from '../api/userAPI.js';
import AuthService from '../utils/auth.js';
import { useCurrentUser } from '../utils/context.js';

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Login = () => {
  const navigate = useNavigate();
  const currentUserContext = useCurrentUser();
  if (!currentUserContext) {
    throw new Error("useCurrentUser must be used within a UserProvider");
  }
  const { setCurrentUser } = currentUserContext;

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
      AuthService.login(tokenData.token, setCurrentUser);
      navigate("/");
    } catch (error) {
      setErrorMessage("Error loggin in :" + error);
    }
  };

  return (
    <Form
      id="login-form"
      data-cy="login-form"
      onSubmit={handleFormSubmit}>
      <Form.Group>
        <Form.Label data-cy="label-username">Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Enter username"
          value={loginInfo.username}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label data-cy="label-password">Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Enter password"
          value={loginInfo.password}
          onChange={handleInputChange}
        />
      </Form.Group>
      {errorMessage && <p id="error-message" data-cy="error-message">{errorMessage}</p>}
      <Button
        id="submit-login-button"
        data-cy="submit-login-button"
        type="submit"
        title="Submit"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
      </Button>
    </Form>
  );
};

export default Login;
