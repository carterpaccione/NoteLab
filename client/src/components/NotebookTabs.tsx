import React, { useState, useEffect, useCallback } from "react";
import { useUserContext } from "../utils/userContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

import "../styles/notebooks.css";

import AddNotebookTab from "./AddNotebook";
import { User, Notebook } from "../models/dataModels.js";
import { fetchUserData } from "../api/userAPI";
import NotebookPage from "./NotebookPage";

interface TabIndex {
    startingIndex: number;
    endingIndex: number;
}

const NotebookTabs = () => {
    const user = useUserContext();
    const [userData, setUserData] = useState<User | null>(null);
    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);
    const [notebookTabIndices, setNotebookTabIndices] = useState<TabIndex>({ startingIndex: 0, endingIndex: 3 });
    console.log("userData", userData);

    const fetchData = useCallback(async () => {
        if (user.user?.id) {
            const fetchedData = await fetchUserData(user.user.id);
            if (!fetchedData.data.Notebooks) {
                setCurrentNotebook(null);
            } else {
                setUserData(fetchedData.data);
                const notebookExists = fetchedData.data.Notebooks.some((notebook: Notebook) => notebook.id === currentNotebook?.id);
                if (!notebookExists) {
                    setCurrentNotebook(null);
                }
            }
        }
    }, [user.user?.id, currentNotebook?.id]);

    // const renderNotebooks = () => {
    //     if (!userData) {
    //         return <p>No user data</p>
    //     } else if (!userData.Notebooks) {
    //         return <p>No notebooks found</p>
    //     }
    //     return userData.Notebooks.map((notebook: Notebook) => {
    //         return (
    //             <Col className={`notebook-tab ${currentNotebook?.id === notebook.id ? 'selected-notebook-tab' : ''}`}
    //                 key={notebook.id}
    //                 onClick={() => setCurrentNotebook(notebook)}>
    //                 <h5>{notebook.title}</h5>
    //             </Col>
    //         );
    //     })
    // };

    const handleShowLess = () => {
        if (notebookTabIndices.startingIndex <= 3) {
            setNotebookTabIndices({ startingIndex: 0, endingIndex: 3 });
        } else {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex - 3, endingIndex: notebookTabIndices.endingIndex - 3 });
        }

        renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex);
    };

    const handleShowMore = () => {
        if (!userData?.Notebooks) {
            return;
        }
        if (notebookTabIndices.endingIndex >= userData?.Notebooks.length) {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex, endingIndex: notebookTabIndices.endingIndex });
        } else {
            setNotebookTabIndices({ startingIndex: notebookTabIndices.startingIndex + 3, endingIndex: notebookTabIndices.endingIndex + 3 });
        }

        renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex);
    }

    const renderNotebooks = (startingIndex: number, endingIndex: number) => {
        if (!userData) {
            return <p>No user data</p>
        } else if (!userData.Notebooks) {
            return <p>No notebooks found</p>
        }
        return userData.Notebooks.slice(startingIndex, endingIndex).map((notebook: Notebook) => (
            <Col className={`notebook-tab ${currentNotebook?.id === notebook.id ? 'selected-notebook-tab' : ''}`}
                key={notebook.id}
                onClick={() => setCurrentNotebook(notebook)}>
                <h5>{notebook.title}</h5>
            </Col>
        ));
    }

    useEffect(() => {
        if (user.user?.id) {
            fetchData();
        }
    }, [user.user?.id, fetchData]);

    return (
        <>
            <Container id="notebook-tabs-container">
                <Row id="notebook-tabs-row">
                    {userData?.Notebooks ? renderNotebooks(notebookTabIndices.startingIndex, notebookTabIndices.endingIndex) : <p>No notebooks found</p>}
                    <Col className='new-tab'>
                        {notebookTabIndices.startingIndex > 0 ?
                            <Button onClick={handleShowLess}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M400-80 0-480l400-400 71 71-329 329 329 329-71 71Z" /></svg>
                            </Button> : null}
                        {userData?.Notebooks && notebookTabIndices.endingIndex < userData.Notebooks.length ?
                            <Button onClick={handleShowMore}>
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M240-400q-33 0-56.5-23.5T160-480q0-33 23.5-56.5T240-560q33 0 56.5 23.5T320-480q0 33-23.5 56.5T240-400Zm240 0q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm240 0q-33 0-56.5-23.5T640-480q0-33 23.5-56.5T720-560q33 0 56.5 23.5T800-480q0 33-23.5 56.5T720-400Z" /></svg>
                            </Button> : null}
                    </Col>
                    <AddNotebookTab handleRefetch={fetchData} />
                </Row>
            </Container>
            <Container>
                <Row>
                    {currentNotebook ? <NotebookPage notebookId={currentNotebook.id} handleRefetch={fetchData} /> : null}
                </Row>
            </Container>
        </>
    );
};

export default NotebookTabs;