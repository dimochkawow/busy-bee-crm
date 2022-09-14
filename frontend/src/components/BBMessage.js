import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Alert } from 'react-bootstrap'
import { dismiss } from '../store/notificationSlice'

const BBMessage = ({ type, children }) => {
    const dispatch = useDispatch()
    const [show, setShow] = useState(true)

    const variantMapping = {
        error: 'danger',
        info: 'warning',
    }

    const onClose = () => {
        setShow(false)
        dispatch(dismiss())
    }

    return (
        <Alert
            variant={variantMapping[type]}
            className='bb-message'
            dismissible
            onClose={onClose}
            show={show}
        >
            {children}
        </Alert>
    )
}

BBMessage.defaultProps = {
    type: 'info',
}

export default BBMessage
