import React, { useState, useEffect, useCallback } from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

import "../styles/notebookpage.css";

import { Notebook, Note } from "../models/dataModels.js";
import { deleteNotebook, fetchNotebook } from "../api/notebookAPI";
import NoteComponent from "./NoteComponent";
import NoteForm from "./NoteForm";

export interface PageProps {
    notebookId: number;
    handleRefetch: () => void;
}

const NotebookPage = (props: PageProps) => {
    const [notebookData, setNotebookData] = useState<Notebook | null>(null);

    const [mainNotes, setMainNotes] = useState<Note[]>([]);
    const [stickyNotes, setStickyNotes] = useState<Note[]>([]);
    const [highlightNotes, setHighlightNotes] = useState<Note[]>([]);
    // const [error, setError] = useState<string | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const handleModalClose = () => setShowModal(false);
    const handleModalShow = () => setShowModal(true);

    const fetchNotebookData = useCallback(async () => {
        try {
            const data = await fetchNotebook(props.notebookId);
            setNotebookData(data.data);
        }
        catch {
            console.error("Error fetching notebook data");
        }
    }, [props.notebookId]);

    const sortNotes = (notes: Note[]) => {
        const mainNotes: Note[] = [];
        const stickyNotes: Note[] = [];
        const highlightNotes: Note[] = [];

        notes.forEach(note => {
            if (note.importance === 'Main') {
                mainNotes.push(note);
            } else if (note.importance === 'Sticky') {
                stickyNotes.push(note);
            } else {
                highlightNotes.push(note);
            }
        });
        setMainNotes(mainNotes);
        setStickyNotes(stickyNotes);
        setHighlightNotes(highlightNotes);
    };

    const handleDeleteButton = async () => {
        await deleteNotebook(props.notebookId);
        props.handleRefetch();
    };

    useEffect(() => {
        fetchNotebookData();
    }, [fetchNotebookData]);

    useEffect(() => {
        if (notebookData) {
            sortNotes(notebookData.Notes);
        }
    }, [notebookData]);

    if (!notebookData || notebookData == null) {
        return <p>No notebook data</p>;
    }

    return (
        <Container id="notebookpage-container">
            <Row>
                <Col>
                    <Button
                        id='notebookpage-button'
                        onClick={() => handleDeleteButton()}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M580-280h80q25 0 42.5-17.5T720-340v-160h40v-60H660v-40h-80v40H480v60h40v160q0 25 17.5 42.5T580-280Zm0-220h80v160h-80v-160ZM160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Zm0-80h640v-400H447l-80-80H160v480Zm0 0v-480 480Z" /></svg>
                    </Button>
                </Col>
                <Col>
                    <Button
                        id='notebookpage-button'
                        onClick={handleModalShow}>
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="m499-287 335-335-52-52-335 335 52 52Zm-261 87q-100-5-149-42T40-349q0-65 53.5-105.5T242-503q39-3 58.5-12.5T320-542q0-26-29.5-39T193-600l7-80q103 8 151.5 41.5T400-542q0 53-38.5 83T248-423q-64 5-96 23.5T120-349q0 35 28 50.5t94 18.5l-4 80Zm280 7L353-358l382-382q20-20 47.5-20t47.5 20l70 70q20 20 20 47.5T900-575L518-193Zm-159 33q-17 4-30-9t-9-30l33-159 165 165-159 33Z" /></svg>
                    </Button>
                </Col>
            </Row>
            <Row>
                <Col sm={{order: 2}} md={{order: 2}} lg={{span: 3, order: 1}}>
                    {highlightNotes.map(note => <NoteComponent key={note.id} note={note} handleRefetch={fetchNotebookData} />)}
                </Col>
                <Col sm={{order: 1}} md={{order: 1}} lg={{span: 6, order: 2}}>
                    {mainNotes.map(note => <NoteComponent key={note.id} note={note} handleRefetch={fetchNotebookData} />)}
                </Col>
                <Col sm={{order: 3}} md={{order: 3}} lg={{span: 3, order: 3}}>
                    {stickyNotes.map(note => <NoteComponent key={note.id} note={note} handleRefetch={fetchNotebookData} />)}
                </Col>
            </Row>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Create A Note</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <NoteForm notebookId={notebookData.id} handleClose={handleModalClose} handleRefetch={fetchNotebookData}></NoteForm>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default NotebookPage;