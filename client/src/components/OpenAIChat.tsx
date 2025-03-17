import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import '../styles/openAI.css';

import { ProblemResponse } from '../models/dataModels';
import { fetchProblemResponse, fetchSummaryResponse } from '../api/openAIApi';

enum ApiState {
    PROBLEM = 'Problem',
    SUMMARY = 'Summary'
}

const OpenAIChat = () => {
    const localStorageProbelmResult = localStorage.getItem('problemResult');
    const localStorageSummaryResult = localStorage.getItem('summaryResult');

    const [apiState, setApiState] = useState<ApiState>(ApiState.PROBLEM);
    const [formState, setFormState] = useState({
        prompt: ""
    });
    const [problemAIResult, setProblemAIResult] = useState<ProblemResponse>(localStorageProbelmResult ? JSON.parse(localStorageProbelmResult) : {
        hint_one: "",
        hint_two: "",
        solution: "",
        code_solution: ""
    });
    const [summaryAIResult, setSummaryAIResult] = useState(localStorageSummaryResult ? JSON.parse(localStorageSummaryResult) : {
        summary: ""
    });
    const [loading, setLoading] = useState(false);
    const [copyStatus, setCopyStatus] = useState("");
    const [error, setError] = useState("");

    const handleAPIStateChange = () => {
        if (apiState === ApiState.PROBLEM) {
            setApiState(ApiState.SUMMARY);
        } else {
            setApiState(ApiState.PROBLEM);
        }
    }

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState({
            ...formState,
            [name]: value
        });
    };

    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (formState.prompt.length === 0) {
            setError("Please enter a prompt");
            return;
        } else if (formState.prompt.length < 10) {
            setError("Prompt must be at least 10 characters");
            return;
        }

        setLoading(true);

        if (apiState === ApiState.PROBLEM) {
            try {
                const problemResponse = await fetchProblemResponse(formState.prompt);
                setProblemAIResult(problemResponse);
                setLoading(false);
                localStorage.setItem('problemResult', JSON.stringify(problemResponse));
            } catch (error) {
                console.error("Error fetching problem response: ", error);
                setError("Error fetching problem response");
                setLoading(false);
            }
        } else {
            try {
                const summaryResponse = await fetchSummaryResponse(formState.prompt);
                setSummaryAIResult(summaryResponse);
                setLoading(false);
                localStorage.setItem('summaryResult', JSON.stringify(summaryResponse));
            } catch (error) {
                console.error("Error fetching summary response: ", error);
                setError("Error fetching summary response");
                setLoading(false);
            }
        }
    };

    const copyToClipboard = (apiState: ApiState) => {
        if (apiState === ApiState.PROBLEM) {
            navigator.clipboard.writeText(problemAIResult.code_solution);
            setCopyStatus("Copied!");
        } else {
            navigator.clipboard.writeText(summaryAIResult.summary);
            setCopyStatus("Copied!");
        }
    };

    const handleShowHint = (hint: string) => {
        const hintElement = document.getElementById(hint);
        if (hintElement) {
            if (hintElement.style.filter === "none") {
                hintElement.style.filter = "blur(5px)";
            }
            else {
                hintElement.style.filter = "none";
            }
        }
    }

    return (
        <Container fluid>
            <Row>
                <Col>
                    <Button title="Change AI State" id='api-state-button' onClick={handleAPIStateChange}>{apiState} Helper</Button>
                    <Row id='response-row'>
                        {apiState === ApiState.PROBLEM ? (
                            <Col className='response-col'>
                                {loading ? <p>Loading...</p> : null}
                                {problemAIResult.hint_one && <Row className='response'><h5 onClick={() => handleShowHint('hint-one')}>Hint 1:</h5><p style={{ filter: 'blur(5px)' }} id='hint-one'>{problemAIResult.hint_one}</p></Row>}
                                {problemAIResult.hint_two && <Row className='response'><h5 onClick={() => handleShowHint('hint-two')}>Hint 2:</h5><p style={{ filter: 'blur(5px)' }} id='hint-two'>{problemAIResult.hint_two}</p></Row>}
                                {problemAIResult.solution && <Row className='response'><h5 onClick={() => handleShowHint('solution')}>Solution:</h5><p style={{ filter: 'blur(5px)' }} id='solution'>{problemAIResult.solution}</p></Row>}
                                {problemAIResult.code_solution && <Row className='response'><h5 onClick={() => handleShowHint('code-solution')}>Code Solution:</h5><pre style={{ filter: 'blur(5px)' }} id='code-solution'><code>{problemAIResult.code_solution}</code></pre></Row>}
                            </Col>
                        ) : (
                            <Col className='response-col'>
                                <p>{summaryAIResult.summary}</p>
                            </Col>
                        )}
                    </Row>
                    {copyStatus.length ? <p>{copyStatus}</p> : null}
                    <Button title="Copy Response" onClick={() => copyToClipboard(apiState)}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" /></svg>
                    </Button>
                    <Form
                        id="chat-form"
                        onSubmit={handleFormSubmit}>
                        <Form.Group>
                            <Form.Control
                                id='prompt-input'
                                as="textarea"
                                rows={3}
                                name="prompt"
                                value={formState.prompt}
                                placeholder={apiState === ApiState.PROBLEM ? 'Enter A Coding Problem' : 'Enter a concept or question you want summarized'}
                                onChange={handleInputChange} />
                        </Form.Group>
                        {error && <p className="error-message">{error}</p>}
                        <Button title="Submit" variant="primary" type="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M268-240 42-466l57-56 170 170 56 56-57 56Zm226 0L268-466l56-57 170 170 368-368 56 57-424 424Zm0-226-57-56 198-198 57 56-198 198Z" /></svg>
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default OpenAIChat;