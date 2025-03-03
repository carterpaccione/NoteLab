import React, { useState, useEffect, useCallback } from "react";
import { useUserContext } from "../utils/userContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "../styles/notebooks.css";

import AddNotebookTab from "./AddNotebook";
import { User, Notebook } from "../models/dataModels.js";
import { fetchUserData } from "../api/userAPI";
import NotebookPage from "./NotebookPage";

const NotebookTabs = () => {
    const user = useUserContext();
    const [userData, setUserData] = useState<User | null>(null);
    const [currentNotebook, setCurrentNotebook] = useState<Notebook | null>(null);

    console.log("userData", userData);

    const fetchData = useCallback(async () => {
        if (user.user?.id) {
            const fetchedData = await fetchUserData(user.user.id);
            if(!fetchedData.data.Notebooks) {
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

    const renderNotebooks = () => {
        if (!userData) {
            return <p>No user data</p>
        } else if (!userData.Notebooks) {
            return <p>No notebooks found</p>
        }
        return userData.Notebooks.map((notebook: Notebook) => {
            return (
                <Col className={`notebook-tab ${currentNotebook?.id === notebook.id ? 'selected-notebook-tab' : ''}`}
                    key={notebook.id}
                    onClick={() => setCurrentNotebook(notebook)}>
                    <h5>{notebook.title}</h5>
                </Col>
            );
        })
    };

    useEffect(() => {
        if (user.user?.id) {
            fetchData();
        }
    }, [user.user?.id, fetchData]);

    return (
        <>
            <Container id="notebook-tabs-container">
                <Row id="notebook-tabs-row">
                    {userData?.Notebooks ? renderNotebooks() : <p>No notebooks found</p>}
                    <AddNotebookTab handleRefetch={fetchData} />
                </Row>
            </Container>
            <Container>
                <Row>
                    {currentNotebook ? <NotebookPage notebookId={currentNotebook.id} handleRefetch={fetchData}/> : null}
                </Row>
            </Container>
        </>
    );
};

export default NotebookTabs;