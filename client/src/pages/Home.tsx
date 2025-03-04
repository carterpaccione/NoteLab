import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../utils/userContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import '../styles/home.css';

import ProblemAI from "../components/ProblemAI";
import NotebookTabs from "../components/NotebookTabs";

const Home = () => {
  const navigate = useNavigate();

  const user = useUserContext();
  console.log("User: ", user);

  const [showAIColumn, setShowAIColumn] = useState(false);

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container fluid id="home-container">
      <Row>
        <Col>
          <h1>Welcome {user.user?.username}</h1>
        </Col>
      </Row>
      <Row>
        <Col id="problem-ai-col">
          <Row>
            <Col>
              {showAIColumn && <ProblemAI />}
            </Col>
            <Col id="problem-ai-button-col">
              <Button onClick={() => setShowAIColumn(!showAIColumn)}>
                Show
              </Button>
            </Col>
          </Row>
        </Col>
        <Col>
          <NotebookTabs />
        </Col>
      </Row>
    </Container>
  )
};

export default Home;