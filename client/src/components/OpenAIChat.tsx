import React, { useState } from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { ProblemResponse } from '../models/dataModels';
import { fetchProblemResponse, fetchSummaryResponse } from '../api/openAIApi';

enum ApiState {
    PROBLEM = 'Problem',
    SUMMARY = 'Summary'
}

const OpenAIChat = () => {

    const [apiState, setApiState] = useState<ApiState>(ApiState.PROBLEM);
    const [formState, setFormState] = useState({
        prompt: ""
    });
    const [problemAIResult, setProblemAIResult] = useState<ProblemResponse>({
        hint_one: "",
        hint_two: "",
        solution: "",
        code_solution: ""
    });
    const [summaryAIResult, setSummaryAIResult] = useState({
        summary: ""
    });

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
        console.log("Form state: ", formState);
        console.log("API State: ", apiState);
        event.preventDefault();

        if (apiState === ApiState.PROBLEM) {
            try {
                const problemResponse = await fetchProblemResponse(formState.prompt);
                console.log("Problem response: ", problemResponse);
                setProblemAIResult(problemResponse);
            } catch (error) {
                console.error("Error fetching problem response: ", error);
            }
        } else {
            try {
                const summaryResponse = await fetchSummaryResponse(formState.prompt);
                console.log("Summary response: ", summaryResponse);
                setSummaryAIResult(summaryResponse);
            } catch (error) {
                console.error("Error fetching summary response: ", error);
            }
        }
    };

    return (
        <Container>
            <Row>
                <Col>
                    <Button onClick={handleAPIStateChange}>{apiState} Helper</Button>
                    <Row>
                        {apiState === ApiState.PROBLEM ? (
                            <Col>
                                {problemAIResult.hint_one && <p>Hint 1: {problemAIResult.hint_one}</p>}
                                {problemAIResult.hint_two && <p>Hint 2: {problemAIResult.hint_two}</p>}
                                {problemAIResult.solution && <p>Solution: {problemAIResult.solution}</p>}
                                {problemAIResult.code_solution && <p>Code Solution: {problemAIResult.code_solution}</p>}
                            </Col>
                        ) : (
                            <Col>
                                <p>{summaryAIResult.summary}</p>
                            </Col>
                        )}
                    </Row>
                    <Form onSubmit={handleFormSubmit}>
                        <Form.Group controlId="formProblemAI">
                            <Form.Label>{apiState === ApiState.PROBLEM ? 'Enter A Coding Problem' : 'Enter something you want summarized'}</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                name="prompt"
                                value={formState.prompt}
                                onChange={handleInputChange} />
                        </Form.Group>
                        <Button variant="primary" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default OpenAIChat;