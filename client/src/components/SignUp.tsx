import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import AuthService from "../utils/auth";
import { fetchSignUp, fetchLogin } from "../api/userAPI.js";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpInfo, setSignUpInfo] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignUpInfo({
      ...signUpInfo,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (signUpInfo.password !== signUpInfo.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    try {
      await fetchSignUp(signUpInfo.email, signUpInfo.username, signUpInfo.password);
      const tokenData = await fetchLogin(signUpInfo.username, signUpInfo.password);
      if (tokenData.error) {
        setErrorMessage(tokenData.error);
        return;
      }
      AuthService.login(tokenData.token);
      navigate("/");
    } catch (error: unknown) {
      setErrorMessage((error as Error).message);
    }
  };

  return (
    <Form
      data-cy="signup-form"
      id="signup-form"
      onSubmit={handleFormSubmit}>
      <Form.Group>
        <Form.Label>Email</Form.Label>
        <Form.Control
          name="email"
          type="email"
          placeholder="Email"
          value={signUpInfo.email}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Username</Form.Label>
        <Form.Control
          name="username"
          type="text"
          placeholder="Username"
          value={signUpInfo.username}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Password</Form.Label>
        <Form.Control
          name="password"
          type="password"
          placeholder="Password"
          value={signUpInfo.password}
          onChange={handleInputChange}
        />
      </Form.Group>
      <Form.Group>
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={signUpInfo.confirmPassword}
          onChange={handleInputChange}
        />
      </Form.Group>
      {errorMessage && <p>{errorMessage}</p>}
      <Button
        data-cy="signup-submit"
        type="submit"
        title="Submit"
        >
        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
      </Button>
    </Form>
  );
};

export default SignUp;
