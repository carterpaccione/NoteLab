import React from 'react';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

interface DeleteModalProps {
    onDelete: () => void;
    handleShow: () => void;
    show: boolean;
}

const DeleteModal = (props: DeleteModalProps) => {
    return (
        <Modal show={props.show} onHide={props.handleShow}>
            <Modal.Body className="text-center">
                <Button title="Delete" data-cy="confirm-delete" variant="danger" onClick={props.onDelete}>Delete</Button>
            </Modal.Body>
        </Modal>
    )
}

export default DeleteModal;