import React, { useState, useEffect, useCallback } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import NotebookTabs from './NotebookTabs';
import NotebookContent from './NotebookContent';
import { fetchUserData } from '../api/userAPI';
import { User, Notebook } from '../models/dataModels';

interface NotebookComponentProps {
    user_id: string;
}

const NotebookComponent = (props: NotebookComponentProps) => {
    const [userData, setUserData] = useState<User | null>(null);
    const [currentNotebook, setCurrentNotebook] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    console.log("Props: ", props);
    console.log("UserData: ", userData);

    const fetchData = useCallback(async () => {
        if (props.user_id) {
            const fetchedData = await fetchUserData(props.user_id);
            console.log("Fetched Data: ", fetchedData);
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
    }, [props.user_id, currentNotebook]);

    useEffect(() => {
        if (props.user_id) {
            fetchData();
        } else {
            setError("User ID not provided");
        }
    }, [props.user_id, fetchData]);

    return (
        <Container>
            <NotebookTabs notebooks={userData?.Notebooks || []} handleRefetch={fetchData} setCurrentNotebook={setCurrentNotebook} />
            <Row>
                {currentNotebook && <NotebookContent notebookId={currentNotebook} handleRefetch={fetchData} />}
            </Row>
            {error && <p>{error}</p>}
        </Container>
    )
}

export default NotebookComponent;