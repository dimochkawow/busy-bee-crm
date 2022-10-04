import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const BBModal = ({ title, children, onSave, onCancel, ...props }) => {
    return (
        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{children}</Modal.Body>
            <Modal.Footer>
                <Button onClick={onSave}>Save</Button>
                <Button variant='info' onClick={onCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BBModal
