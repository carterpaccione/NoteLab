import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import '../styles/sticky.css';

import { Note } from '../models/dataModels.js';

interface StickyProps {
    note: Note;
}

const Sticky = (props: StickyProps) => {
    return (
        <Container id="sticky-container">
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

export default Sticky;