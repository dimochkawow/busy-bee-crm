import React from 'react'
import Spinner from 'react-bootstrap/Spinner'

const BBSpinner = () => {
    return (
        <div className='spinner-container'>
            <Spinner animation='grow' size='lg' variant='info' />
            <Spinner animation='grow' size='lg' variant='info' />
            <Spinner animation='grow' size='lg' variant='info' />
        </div>
    )
}

export default BBSpinner
