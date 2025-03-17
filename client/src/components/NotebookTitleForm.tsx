import React, { useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import { updateNotebookTitle } from '../api/notebookAPI';

interface NotebookTitleFormProps {
    notebookId: number;
    title: string;
    handleRefetch: () => void;
    handleClose: () => void;
}

const NotebookTitleForm = (props: NotebookTitleFormProps) => {

    const [newTitle, setNewTitle] = useState<string>(props.title);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTitle(e.target.value);
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            await updateNotebookTitle(props.notebookId, newTitle);
            props.handleRefetch();
            props.handleClose();
            setNewTitle('');
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            }
            console.error('Failed to update notebook title');
        }
    };

    return (
        <Form id="new-notebook-form" data-cy="edit-notebook-form" onSubmit={handleFormSubmit}>
            <Form.Group>
                <Form.Control
                    name='newTitle'
                    type='text'
                    placeholder={props.title}
                    value={newTitle}
                    onChange={handleInputChange}
                />
            </Form.Group>
            <Button data-cy="submit-new-notebook-title" id='submit-new-notebook' type="submit" title="Submit">
                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-304 240-464l56-56 104 104 264-264 56 56-320 320Z" /></svg>
            </Button>
        </Form>
    )
}

export default NotebookTitleForm;