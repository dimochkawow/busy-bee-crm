import React from 'react'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'

const BBModal = (props) => {
    return (
        <Modal
            {...props}
            size='lg'
            aria-labelledby='contained-modal-title-vcenter'
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id='contained-modal-title-vcenter'>
                    {props.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>{props.children}</Modal.Body>
            <Modal.Footer>
                <Button onClick={props.onSave}>Save</Button>
                <Button variant='info' onClick={props.onCancel}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default BBModal
