import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import '../styles/home.css';

import AuthService from '../utils/auth';
import { UserContextType, useCurrentUser } from '../utils/context.js';

import OpenAIChat from "../components/OpenAIChat";
import NotebookComponent from '../components/NotebookComponent';

const Home = () => {
  const navigate = useNavigate();
  const userContext = useCurrentUser();
  if (!userContext?.currentUser) {
    console.log("useUserContext must be used within a UserProvider");
  } 
  const { setCurrentUser } = userContext as UserContextType;

  const [showAIColumn, setShowAIColumn] = useState(false);

  useEffect(() => {
    if (!AuthService.loggedIn()) {
      navigate('/login');
    } else {
      const authorizedUser = AuthService.getProfile();
      setCurrentUser(authorizedUser);
    }
  }, [navigate, setCurrentUser]);


  return (
    <Container fluid id="home-container">
      <Row id='header-row'>
        <Col id="show-ai-col">
          <Button id='show-ai-button' title='AI Helper'onClick={() => setShowAIColumn(!showAIColumn)}>
            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-80v-172q-57-52-88.5-121.5T120-520q0-150 105-255t255-105q125 0 221.5 73.5T827-615l52 205q5 19-7 34.5T840-360h-80v120q0 33-23.5 56.5T680-160h-80v80h-80v-160h160v-200h108l-38-155q-23-91-98-148t-172-57q-116 0-198 81t-82 197q0 60 24.5 114t69.5 96l26 24v208h-80Zm254-360Zm-14 120q17 0 28.5-11.5T520-360q0-17-11.5-28.5T480-400q-17 0-28.5 11.5T440-360q0 17 11.5 28.5T480-320Zm-30-128h61q0-25 6.5-40.5T544-526q18-20 35-40.5t17-53.5q0-42-32.5-71T483-720q-40 0-72.5 23T365-637l55 23q7-22 24.5-35.5T483-663q22 0 36.5 12t14.5 31q0 21-12.5 37.5T492-549q-20 21-31 42t-11 59Z" /></svg>
          </Button>
        </Col>
        <Col id='welcome-message-col' className='text-center'>
          <h1>Welcome {userContext?.currentUser?.username}</h1>
        </Col>
      </Row>
      <Row id="content-row">
        {showAIColumn ? (
          <Col sm={{ span: 12, order: 1 }} md={{ span: 12, order: 1 }} lg={{ span: 4, order: 1 }}
            id="openAI-col">
            <OpenAIChat />
          </Col>) : null}
        <Col {...(showAIColumn ? { sm: { span: 12, order: 2 }, md: { span: 12, order: 2 }, lg: { span: 8, order: 2 } } : { sm: { span: 12, order: 1 }, md: { span: 12, order: 1 }, lg: { span: 12, order: 1 } })}>
          {userContext && <NotebookComponent />}
        </Col>
      </Row>
    </Container>
  )
};

export default Home;