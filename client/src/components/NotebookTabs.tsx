import React, { useState } from "react";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import "../styles/notebooks.css";

import AddNotebookTab from "./AddNotebook";
import NotebookTitleForm from "./NotebookTitleForm";
import { Notebook } from "../models/dataModels.js";


interface TabIndex {
    startingIndex: number;
    endingIndex: number;
}

interface NotebookTabProps {
    notebooks: Notebook[];
    handleRefetch: () => void;
    setCurrentNotebook: React.Dispatch<React.SetStateAction<number | null>>;
}

const NotebookTabs = (props: NotebookTabProps) => {
    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
    const [notebookTabIndices, setNotebookTabIndices] = useState<TabIndex>({ startingIndex: 0, endingIndex: 3 });
    const [editingNotebookId, setEditingNotebookId] = useState<number | null>(null);


    const handleShowLess = () => {
        if (notebookTabIndices.startingIndex <= 3) {
            setNotebookTabIndices({ startingIndex: 0, endingIndex: 3 });
        } else {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex - 3, endingIndex: notebookTabIndices.endingIndex - 3 });
        }

        renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex);
    };

    const handleShowMore = () => {
        if (props.notebooks.length <= 3) {
            return;
        }
        if (notebookTabIndices.endingIndex >= props.notebooks.length) {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex, endingIndex: notebookTabIndices.endingIndex });
        } else {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex + 3, endingIndex: notebookTabIndices.endingIndex + 3 });
        }

        renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex);
    }

    const handleEditTitleClick = (notebookId: number) => {
        setEditingNotebookId(editingNotebookId === notebookId ? null : notebookId);
    };

    const renderNotebooks = (startingIndex: number, endingIndex: number) => {
        return props.notebooks.slice(startingIndex, endingIndex).map((notebook) => {
            return (
                <Col key={notebook.id} // Use notebook.id instead of index for uniqueness
                    data-cy={`notebook-tab-${notebook.title}`}
                    className={`notebook-tab ${currentNotebook?.id === notebook.id ? 'selected-notebook-tab' : ''}`}
                    onClick={() => { setCurrentNotebook(notebook); props.setCurrentNotebook(notebook.id); }}
                >
                    {editingNotebookId === notebook.id ? (
                        <NotebookTitleForm
                            notebookId={notebook.id}
                            title={notebook.title}
                            handleRefetch={props.handleRefetch}
                            handleClose={() => setEditingNotebookId(null)}
                        />
                    ) : (
                        <p>
                            {notebook.title}
                            <Button title="Edit Title" data-cy={`edit-title-button-${notebook.title}`} className='edit-title-button' onClick={() => handleEditTitleClick(notebook.id)}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000">
                                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                                </svg>
                            </Button>
                        </p>
                    )}
                </Col>
            );
        });
    };

    if (!props.notebooks || props.notebooks.length === 0 || props.notebooks === undefined || props.notebooks === null) {
        return (
            <Row>
                <AddNotebookTab handleRefetch={props.handleRefetch} />
            </Row>
        )
    }

    return (
        <Row id="notebook-tabs-row">
            {props.notebooks.length > 0 ? renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex) : <p>No notebooks found</p>}
            {props.notebooks.length > 0 && props.notebooks.length <= 3 ? null : <Col className='new-tab'>
                {notebookTabIndices.startingIndex > 0 ?
                    <Button title="Go Back" onClick={handleShowLess}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                    </Button> : null}
                {props.notebooks.length && notebookTabIndices.endingIndex < props.notebooks.length ?
                    <Button title="Show More" onClick={handleShowMore}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" /></svg>
                    </Button> : null}
            </Col>}
            <AddNotebookTab handleRefetch={props.handleRefetch} />
        </Row>
    );
};

export default NotebookTabs;