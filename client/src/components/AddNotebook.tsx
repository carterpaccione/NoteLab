import React, { useState } from "react";

import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { createNotebook } from "../api/notebookAPI.js";
import AuthService from "../utils/auth.js";

interface AddNotebookTabProps {
    handleRefetch: () => void;
}

const AddNotebookTab = (props: AddNotebookTabProps) => {

    const token = AuthService.getToken();
    const [formShowing, setFormShowing] = useState(false);
    const [notebookTitle, setNotebookTitle] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNotebookTitle(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (token) {
            try {
                await createNotebook(notebookTitle, token);
                setFormShowing(false);
                props.handleRefetch();
            } catch {
                console.error("Error creating notebook");
            }
        } else {
            console.error("User ID is undefined");
        }
        setNotebookTitle('');
        setFormShowing(false);
    };

    const renderForm = () => {
        return (
            <Form data-cy="new-notebook-form" id="new-notebook-form" onSubmit={handleFormSubmit}>
                <Form.Group>
                    <Form.Control
                        name="notebookTitle"
                        type="text"
                        placeholder="Enter title"
                        value={notebookTitle}
                        onChange={handleInputChange}
                    />
                </Form.Group>
                <Button title="Submit" data-cy="submit-new-notebook" id='submit-new-notebook' type="submit">
                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" /></svg>
                </Button>
            </Form>
        )
    };

    return (
        <Col className='new-tab align-items-center'>
            {formShowing && renderForm()}
            <Button
                title="Add Notebook"
                data-cy='add-notebook-button'
                id='add-notebook-button'
                onClick={() => setFormShowing(!formShowing)}>
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" /></svg>
            </Button>
        </Col>
    );
}

export default AddNotebookTab;