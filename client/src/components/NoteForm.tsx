import React, { useState } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createNote } from '../api/noteApi.js';

import '../styles/noteform.css';

interface NoteFormProps {
    notebookId: number;
    handleRefetch: () => void;
    handleClose: () => void;
}

const NoteForm = (props: NoteFormProps) => {
    const [newNote, setNewNote] = useState({
        notebook_id: props.notebookId,
        content: "",
        importance: "Main"
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewNote({
            ...newNote,
            [name]: value
        });
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setNewNote({
            ...newNote,
            importance: e.target.value
        });
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await createNote(newNote.notebook_id, newNote.content, newNote.importance);
            props.handleRefetch();
            props.handleClose();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Form data-cy="note-form" onSubmit={handleFormSubmit}>
            <Form.Group controlId="importance">
                <Form.Label>Select Note Category</Form.Label>
                <Form.Select
                    data-cy="note-form-importance"
                    onChange={handleSelectChange}>
                    <option value="Main">Main</option>
                    <option value="Highlight">Highlight</option>
                    <option value="Sticky">Code</option>
                </Form.Select>
            </Form.Group>
            <Form.Group controlId="noteContent">
                <Form.Label>Note Content</Form.Label>
                <Form.Control
                    as="textarea"
                    name="content"
                    value={newNote.content}
                    rows={6}
                    placeholder="Enter note content"
                    onChange={handleInputChange} />
            </Form.Group>
            <Button data-cy="note-form-submit" variant="primary" type="submit" title="Submit">
                Submit
            </Button>
        </Form>
    );
}

export default NoteForm;