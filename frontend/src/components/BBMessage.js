import React from 'react'
import { Alert } from 'react-bootstrap'

const BBMessage = ({ variant, children }) => {
    return (
        <Alert variant={variant} className='bb-message'>
            {children}
        </Alert>
    )
}

BBMessage.defaultProps = {
    variant: 'primary',
}

export default BBMessage
