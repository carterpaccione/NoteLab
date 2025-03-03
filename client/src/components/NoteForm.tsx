import React, { useState } from "react";

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { createNote } from '../api/noteApi.js';

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
        <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="importance">
                <Form.Label>Select Note Category</Form.Label>
                <Form.Select onChange={handleSelectChange}>
                    <option value="Main">Main</option>
                    <option value="Highlight">Highlight</option>
                    <option value="Sticky">Sticky</option>
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
            <Button variant="primary" type="submit">
                Submit
            </Button>
        </Form>
    );
}

export default NoteForm;