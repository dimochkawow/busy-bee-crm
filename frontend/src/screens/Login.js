import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import BBSpinner from '../components/BBSpinner'
import { login } from '../store/authSlice'

const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { currentUser, loading } = useSelector((state) => state.auth)
    const dispatch = useDispatch()
    const searchParams = useSearchParams()[0]
    const navigate = useNavigate()
    const redirect = searchParams.get('redirect')
        ? searchParams.get('redirect')
        : '/'

    const onLogin = (e) => {
        e.preventDefault()
        dispatch(login({ email, password }))
    }

    useEffect(() => {
        if (currentUser) {
            navigate(redirect)
        } else {
            setEmail('')
            setPassword('')
        }
    }, [currentUser, navigate, redirect, dispatch])

    return (
        <>
            {loading && <BBSpinner />}
            <Card className='login-card'>
                <Form>
                    <Form.Group className='mb-3' controlId='email'>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type='email'
                            placeholder='Enter email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className='mb-3' controlId='password'>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type='password'
                            placeholder='Password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>
                    <Button variant='primary' type='submit' onClick={onLogin}>
                        Log In
                    </Button>
                </Form>
            </Card>
        </>
    )
}

export default Login
