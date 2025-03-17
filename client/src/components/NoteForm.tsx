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
        // get the key that is pressed to do that we need to destructure the event object
        // and get the name and value of the target element
        console.log(e.target);

        const { name, value } = e.target;
        setNewNote({
            ...newNote,
            [name]: value
        });
    };

    const handleTabKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Tab') {
            e.preventDefault();
            const { selectionStart, selectionEnd } = e.currentTarget;
            const newValue = `${newNote.content.substring(0, selectionStart)}\t${newNote.content.substring(selectionEnd)}`;
            setNewNote({
                ...newNote,
                content: newValue
            });
        }
    }

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
            if (err instanceof Error) {
                console.error(err.message);
            }
            console.error('Failed to create note');
        }
    };

    return (
        <Form data-cy="note-form" onSubmit={handleFormSubmit}>
            <Form.Group>
                <Form.Label>Select Note Category</Form.Label>
                <Form.Select
                    data-cy="note-form-importance"
                    onChange={handleSelectChange}>
                    <option value="Main">Main</option>
                    <option value="Highlight">Highlight</option>
                    <option value="Sticky">Code</option>
                </Form.Select>
            </Form.Group>
            <Form.Group>
                <Form.Label>Note Content</Form.Label>
                <Form.Control
                    id="note-content"
                    as="textarea"
                    name="content"
                    value={newNote.content}
                    rows={6}
                    placeholder="Enter note content"
                    onChange={handleInputChange}
                    onKeyDown={handleTabKey} />
            </Form.Group>
            <Button data-cy="note-form-submit" variant="primary" type="submit" title="Submit">
                Submit
            </Button>
        </Form>
    );
}

export default NoteForm;