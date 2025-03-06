import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useUserContext } from "../utils/userContext";

import Login from "../components/Login";
import SignUp from "../components/SignUp";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

import '../styles/loginPage.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [pageState, setPageState] = useState("login");
    const user = useUserContext();

    useEffect(() => {
        if (user.token) {
            navigate("/");
        }
    })
    return (
        <Container id='login-page-container'>
            <Row className='login-page-row'>
                <Col id='button-col'>
                    <Button
                    className='login-page-button'
                    onClick={() => setPageState("login")}>Login</Button>
                </Col>
                <Col id='button-col'>
                    <Button
                    className='login-page-button'
                    onClick={() => setPageState("signup")}>Sign Up</Button>
                </Col>
            </Row>
            <Row className='login-page-row'>
                <Col className='login-page-col'>
                    {pageState === "login" ? <Login /> : <SignUp />}
                </Col>
            </Row>
        </Container>
    )
};

export default LoginPage;