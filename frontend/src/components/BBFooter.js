import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

const BBFooter = () => {
    return (
        <footer>
            <Container bg='primary'>
                <Row>
                    <Col className='text-center py-3'>
                        Copyright &copy; Busy Bee CMS 2022
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default BBFooter
