import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../store/loginSlice'
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap'

const BBNavbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.login)

    const onLogout = () => {
        dispatch(logout())
    }

    useEffect(() => {
        if (!currentUser) {
            navigate('/login')
        }
    }, [currentUser, navigate])

    return (
        <Navbar bg='dark' variant='dark' expand='lg' sticky='top'>
            <Container fluid>
                <LinkContainer to='/'>
                    <Navbar.Brand className='bb-navbar-brand'>
                        Busy Bee CRM
                    </Navbar.Brand>
                </LinkContainer>
                <Navbar.Toggle aria-controls='bb-navbar-nav' />
                <Navbar.Collapse id='bb-navbar-nav'>
                    <Nav className='bb-navbar-nav'>
                        <LinkContainer to='/customers'>
                            <Nav.Link>Customers</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to='/employees'>
                            <Nav.Link>Employees</Nav.Link>
                        </LinkContainer>
                        <NavDropdown
                            title='Entities'
                            id='bb-navbar-dropdown-entities'
                            className='bb-navbar-dropdown'
                        >
                            <LinkContainer to='/employees/new'>
                                <NavDropdown.Item>Create new</NavDropdown.Item>
                            </LinkContainer>
                            <LinkContainer to='/employees/search'>
                                <NavDropdown.Item>Search</NavDropdown.Item>
                            </LinkContainer>
                        </NavDropdown>
                        <LinkContainer to='/leads'>
                            <Nav.Link>Leads</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav className='bb-navbar-nav login-profile'>
                        {!currentUser && (
                            <LinkContainer to='/login'>
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        {currentUser && (
                            <NavDropdown
                                title={`${currentUser.firstName} ${currentUser.lastName}`}
                                id='bb-navbar-dropdown-profile'
                                className='bb-navbar-dropdown'
                            >
                                <LinkContainer to='/profile/settings'>
                                    <NavDropdown.Item>
                                        Settings
                                    </NavDropdown.Item>
                                </LinkContainer>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={onLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default BBNavbar
