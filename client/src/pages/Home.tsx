import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../utils/userContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import NotebookTabs from "../components/NotebookTabs";

const Home = () => {
  const navigate = useNavigate();

  const user = useUserContext();
  console.log("User: ", user);

  useEffect(() => {
    if (!user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <Container>
      <Row>
        <Col>
          <h1>Welcome {user.user?.username}</h1>
        </Col>
      </Row>
      <Row>
        <NotebookTabs />
      </Row>
    </Container>
  )
};

export default Home;