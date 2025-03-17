import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../styles/note.css';

import { Note } from '../models/dataModels.js';
import { deleteNote, updateNote } from '../api/noteApi.js';

import DeleteModal from './DeleteModal';
interface NoteProps {
    note: Note;
    handleRefetch: () => void;
}

const NoteComponent = (props: NoteProps) => {

    const [editNote, setEditNote] = useState({
        notebook_id: props.note.notebookId,
        content: props.note.content,
        importance: props.note.importance.toString(),
    });

    const [formShow, setFormShow] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
    const handleShowDeleteModal = () => {
        setShowDeleteModal(!showDeleteModal);
        return !showDeleteModal;
    }

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
                    <Form.Select data-cy="note-form-importance" onChange={handleSelectChange}>
                        <option value="Main">Main</option>
                        <option value="Highlight">Highlight</option>
                        <option value="Sticky">Code</option>
                    </Form.Select>
                );
            case "Highlight":
                return (
                    <Form.Select data-cy="note-form-importance" onChange={handleSelectChange}>
                        <option value="Highlight">Highlight</option>
                        <option value="Main">Main</option>
                        <option value="Sticky">Code</option>
                    </Form.Select>
                );
            case "Sticky":
                return (
                    <Form.Select data-cy="note-form-importance" onChange={handleSelectChange}>
                        <option value="Sticky">Code</option>
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
            if (err instanceof Error) {
                console.error(err.message);
            }
            console.error('Failed to update note content');
        }
    };

    const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.currentTarget;
            const newValue = `${editNote.content.substring(0, selectionStart)}\t${editNote.content.substring(selectionEnd)}`;
            setEditNote({
                ...editNote,
                content: newValue
            });
        }
    }

    return (
        <Container id={`${setContainerProperties()}`} className='note-container'>
            <Row id='note-header' data-cy="note-header">
                <Col>
                    <Button
                        title="Edit Note"
                        data-cy="edit-note-button"
                        onClick={() => setFormShow(!formShow)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M160-400v-80h280v80H160Zm0-160v-80h440v80H160Zm0-160v-80h440v80H160Zm360 560v-123l221-220q9-9 20-13t22-4q12 0 23 4.5t20 13.5l37 37q8 9 12.5 20t4.5 22q0 11-4 22.5T863-380L643-160H520Zm300-263-37-37 37 37ZM580-220h38l121-122-18-19-19-18-122 121v38Zm141-141-19-18 37 37-18-19Z" />
                        </svg>
                    </Button>
                </Col>
                <Col>
                    <p style={{ color: 'black' }}>{new Date(props.note.createdAt).toLocaleDateString()}</p>
                </Col>
                <Col>
                    <Button
                        title="Delete Note"
                        id="delete-button"
                        data-cy="delete-note-button"
                        onClick={handleShowDeleteModal}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" /></svg>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col id="note-content" data-cy="note-content">
                    {formShow ? (
                        <Form data-cy="update-note-form" onSubmit={handleUpdateNoteContent}>
                            <Form.Group>
                                {renderOptions()}
                            </Form.Group>
                            <Form.Group>
                                <Form.Control
                                    id="note-form-content"
                                    data-cy="note-form-content"
                                    as="textarea"
                                    name="content"
                                    value={editNote.content}
                                    onChange={handleInputChange}
                                    onKeyDown={handleTabKey}
                                />
                            </Form.Group>
                            <Button
                                title="Submit"
                                id="submit-update-button"
                                data-cy="submit-update-button"
                                type="submit">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
                            </Button>
                        </Form>
                    ) : (
                        props.note.importance === 'Sticky' ? (
                            <pre>
                                <code>{props.note.content}</code>
                            </pre>
                        ) : (
                            <pre>{props.note.content}</pre>
                        )
                    )}
                </Col>
            </Row>
            <DeleteModal show={showDeleteModal} handleShow={handleShowDeleteModal} onDelete={handleDeleteButton} />
        </Container>
    );
}

export default NoteComponent;