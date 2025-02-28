import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../styles/highlight.css';

import { Note } from '../models/dataModels.js';

interface HighlightProps {
    note: Note;
}

const Highlight = (props: HighlightProps) => {
    return (
        <Container id="highlight-container">
            <Row>
                <Col>
                    <p>{new Date(props.note.created_at).toLocaleDateString()}</p>
                </Col>
            </Row>
            <Row>
                <Col>
                    <p>{props.note.content}</p>
                </Col>
            </Row>
        </Container>
    );
}

export default Highlight;