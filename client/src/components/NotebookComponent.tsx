import React, { useState, useEffect, useCallback } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import NotebookTabs from './NotebookTabs';
import NotebookContent from './NotebookContent';
import { fetchUserData } from '../api/userAPI';
import { User, Notebook } from '../models/dataModels';


const NotebookComponent = () => {
    const [userData, setUserData] = useState<User | null>(null);
    const [currentNotebook, setCurrentNotebook] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (token) {
            const fetchedData = await fetchUserData(token);
            if (!fetchedData.data.Notebooks) {
                setCurrentNotebook(null);
            } else {
                setUserData(fetchedData.data);
                const notebookExists = fetchedData.data.Notebooks.some((notebook: Notebook) => notebook.id === currentNotebook);
                if (!notebookExists) {
                    setCurrentNotebook(null);
                }
            }
        }
    }, [currentNotebook]);

    useEffect(() => {
        try {
            fetchData();
        } catch (error) {
            setError((error as Error).message);
        }
    }, [fetchData]);

    return (
        <Container fluid>
            <NotebookTabs notebooks={userData?.Notebooks || []} handleRefetch={fetchData} setCurrentNotebook={setCurrentNotebook} />
            <Row>
                {currentNotebook && <NotebookContent notebookId={currentNotebook} handleRefetch={fetchData} />}
            </Row>
            {error && <p>{error}</p>}
        </Container>
    )
}

export default NotebookComponent;