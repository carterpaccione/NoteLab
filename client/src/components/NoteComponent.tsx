import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../styles/note.css';

import { Note } from '../models/dataModels.js';
import { deleteNote, updateNote } from '../api/noteApi.js';

interface MainProps {
    note: Note;
    handleRefetch: () => void;
}

const NoteComponent = (props: MainProps) => {

    const [editNote, setEditNote] = useState({
        notebook_id: props.note.notebookId,
        content: props.note.content,
        importance: props.note.importance.toString(),
    });

    const [formShow, setFormShow] = useState(false);

    const setContainerProperties = () => {
        switch (props.note.importance.toString()) {
            case "Main":
                return "main-note-container";
            case "Highlight":
                return "highlight-container";
            case "Sticky":
                return "sticky-container";
            default:
                return "";
        }
    };

    const renderOptions = () => {
        switch (props.note.importance.toString()) {
            case "Main":
                return (
                    <Form.Select onChange={handleSelectChange}>
                        <option value="Main">Main</option>
                        <option value="Highlight">Highlight</option>
                        <option value="Sticky">Sticky</option>
                    </Form.Select>
                );
            case "Highlight":
                return (
                    <Form.Select onChange={handleSelectChange}>
                        <option value="Highlight">Highlight</option>
                        <option value="Main">Main</option>
                        <option value="Sticky">Sticky</option>
                    </Form.Select>
                );
            case "Sticky":
                return (
                    <Form.Select onChange={handleSelectChange}>
                        <option value="Sticky">Sticky</option>
                        <option value="Main">Main</option>
                        <option value="Highlight">Highlight</option>
                    </Form.Select>
                );
            default:
                return null;
        }
    }

    const handleDeleteButton = async () => {
        const response = await deleteNote(props.note.id);
        if (response.error) {
            console.error(response.error);
        } else {
            console.log("Note deleted");
            props.handleRefetch();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditNote({ ...editNote, [name]: value });
    }

    const handleSelectChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        setEditNote({ ...editNote, importance: e.target.value });
    };

    const handleUpdateNoteContent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateNote(props.note.id, editNote.content, editNote.importance);
            props.handleRefetch();
            setFormShow(false);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Container id={`${setContainerProperties()}`}>
            <Row>
                <Col>
                    <a onClick={() => setFormShow(!formShow)}>Edit</a>
                </Col>
                <Col>
                    <Button onClick={handleDeleteButton}>
                        DELETE
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col>
                    {formShow ? (
                        <Form onSubmit={handleUpdateNoteContent}>
                            <Form.Group controlId="importance">
                                {renderOptions()}
                            </Form.Group>
                            <Form.Group controlId="noteContent">
                                <Form.Control
                                    as="textarea"
                                    name="content"
                                    value={editNote.content}
                                    onChange={handleInputChange}
                                />
                            </Form.Group>
                            <Button type="submit">
                                Save
                            </Button>
                        </Form>
                    ) : (
                        <p>{props.note.content}</p>
                    )}
                </Col>
            </Row>
        </Container>
    );
}

export default NoteComponent;