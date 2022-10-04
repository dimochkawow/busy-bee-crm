import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Row from 'react-bootstrap/Row'
import Button from 'react-bootstrap/Button'
import FormCheck from 'react-bootstrap/FormCheck'
import BBSpinner from '../components/BBSpinner'
import { register } from '../store/authSlice'

const EnrollEmployee = () => {
    const dispatch = useDispatch()
    const { loading } = useSelector((state) => state.auth)

    const [fullName, setFullName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [isActive, setIsActive] = useState(false)

    const enroll = (e) => {
        e.preventDefault()
        const newEmployee = {
            fullName,
            email,
            password,
            confirmPassword,
            isAdmin,
            isActive,
        }
        dispatch(register(newEmployee))
    }

    return (
        <>
            {loading && <BBSpinner />}
            <h2>Enroll an employee</h2>
            <Form onSubmit={enroll} className='enroll-employee-form'>
                <Row>
                    <Col md={6}>
                        <h3 className='mb-5'>General information</h3>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='fullName'
                        >
                            <Form.Label column sm={3}>
                                Full name
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='text'
                                    placeholder='John Doe'
                                    value={fullName}
                                    onChange={(e) =>
                                        setFullName(e.target.value)
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row} className='mb-3' controlId='email'>
                            <Form.Label column sm={3}>
                                E-mail
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='email'
                                    placeholder='john.doe@bb.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='password'
                        >
                            <Form.Label column sm={3}>
                                Password
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='password'
                                    placeholder='Be creative..'
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group
                            as={Row}
                            className='mb-5'
                            controlId='confirmPassword'
                        >
                            <Form.Label column sm={3}>
                                Confirm password
                            </Form.Label>
                            <Col sm={9}>
                                <Form.Control
                                    type='password'
                                    placeholder='Confirm it!'
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <h3 className='mb-5'>Preferences</h3>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='isAdmin'
                        >
                            <Col sm={9}>
                                <FormCheck type='switch'>
                                    <FormCheck.Input
                                        id='is-admin-checkbox'
                                        value={isAdmin}
                                        defaultChecked={isAdmin}
                                        onChange={(e) =>
                                            setIsAdmin((prev) => !prev)
                                        }
                                    />
                                    <FormCheck.Label htmlFor='is-admin-checkbox'>
                                        Is admin?
                                    </FormCheck.Label>
                                </FormCheck>
                            </Col>
                        </Form.Group>
                        <Form.Group
                            as={Row}
                            className='mb-3'
                            controlId='isActive'
                        >
                            <Col sm={9}>
                                <FormCheck type='switch'>
                                    <FormCheck.Input
                                        id='is-active-checkbox'
                                        value={isActive}
                                        defaultChecked={isActive}
                                        onChange={(e) =>
                                            setIsActive((prev) => !prev)
                                        }
                                    />
                                    <FormCheck.Label htmlFor='is-active-checkbox'>
                                        Is active?
                                    </FormCheck.Label>
                                </FormCheck>
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={12}>
                        <Button type='submit' size='lg' variant='warning'>
                            Enroll
                        </Button>
                    </Col>
                </Row>
            </Form>
        </>
    )
}

export default EnrollEmployee
