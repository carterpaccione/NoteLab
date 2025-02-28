import React, { useState, useEffect, useCallback } from "react";
import { useUserContext } from "../utils/userContext";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import "../styles/notebooks.css";

import AddNotebookTab from "./AddNotebook";
import { User, Notebook } from "../models/dataModels.js";
import { fetchUserData } from "../api/userAPI";
import Page from "./Page";

const NotebookTabs = () => {
    const user = useUserContext();
    const [userData, setUserData] = useState<User | null>(null);
    const [notebookID, setNotebookID] = useState<number | null>(null);

    console.log("userData", userData);

    const fetchData = useCallback(async () => {
        if (user.user?.id) {
            const data = await fetchUserData(user.user.id);
            setUserData(data.data.user);
        }
    }, [user.user?.id]);

    useEffect(() => {
        fetchData();
    }, [user.user?.id, fetchData]);

    const renderNotebooks = () => {
        if (!userData) {
            return <p>No user data</p>
        }
        return userData.notebooks.map((notebook: Notebook) => {
            return (
                <Col className={`notebook-tab ${notebookID === notebook.id ? 'selected-notebook-tab' : ''}`}
                    key={notebook.id}
                    onClick={() => setNotebookID(notebook.id)}>
                    <h5>{notebook.title}</h5>
                </Col>
            );
        })
    };

    return (
        <>
            <Container id="notebook-tabs-container">
                <Row id="notebook-tabs-row">
                    {userData?.notebooks ? renderNotebooks() : <p>No notebooks found</p>}
                    <AddNotebookTab handleRefetch={fetchData} />
                </Row>
            </Container>
            <Container>
                <Row>
                    {notebookID && <Page notebookId={notebookID} handleRefetch={fetchData} />}
                </Row>
            </Container>
        </>
    );
};

export default NotebookTabs;