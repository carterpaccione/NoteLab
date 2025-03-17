import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../utils/auth";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import '../styles/loginpage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    if (AuthService.loggedIn()) {
        navigate('/');
    };
    const [pageState, setPageState] = useState("login");

    return (
        <Container id='login-page-container'>
            <Row>
                <Col id='login-page-banner' >
                    <Row  className='login-page-row'>
                        <Col>
                            <h1 id='login-page-title'>Welcome to the Notebook App!</h1>
                            <h2>
                                This app is a simple notebook application that allows you to create, read, update, and delete notes.
                                You can also create, read, update, and delete notebooks to organize your notes.
                            </h2>
                        </Col>
                    </Row>
                    <Row className='login-page-row'>
                        <Col>
                            <h2 id='login-page-subtitle'>Please login or sign up to continue.</h2>
                        </Col>
                    </Row>
                </Col>
                <Col>
                    <Row className='login-page-row'>
                        <Col id='button-col'>
                            <Button
                                data-cy='login-button'
                                className='login-page-button'
                                title="Login"
                                onClick={() => setPageState("login")}>Login</Button>
                        </Col>
                        <Col id='button-col'>
                            <Button
                                data-cy='signup-button'
                                className='login-page-button'
                                title="Sign Up"
                                onClick={() => setPageState("signup")}>Sign Up</Button>
                        </Col>
                    </Row>
                    <Row className='login-page-row'>
                        <Col className='login-page-col'>
                            {pageState === "login" ? <Login /> : <SignUp />}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    )
};

export default LoginPage;