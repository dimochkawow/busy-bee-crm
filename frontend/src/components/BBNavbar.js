import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { LinkContainer } from 'react-router-bootstrap'
import { logout } from '../store/authSlice'
import { show } from '../store/notificationSlice'
import { Navbar, Container, Nav, NavDropdown, Image } from 'react-bootstrap'
import { EMPLOYEE_PROFILE_DOWNLOAD } from '../http/urls'

const BBNavbar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { currentUser } = useSelector((state) => state.auth)

    const onLogout = () => {
        dispatch(logout())
        dispatch(
            show({
                type: 'info',
                text: `You've been logged out`,
            })
        )
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
                        {currentUser && (
                            <LinkContainer to='/customers'>
                                <Nav.Link>Customers</Nav.Link>
                            </LinkContainer>
                        )}
                        {currentUser?.isAdmin && (
                            <NavDropdown
                                title='Employees'
                                id='bb-navbar-dropdown-entities'
                                className='bb-navbar-dropdown'
                            >
                                <LinkContainer to='/employees/new'>
                                    <NavDropdown.Item>Enroll</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to='/employees/search'>
                                    <NavDropdown.Item>Search</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        )}
                        {currentUser && (
                            <>
                                <NavDropdown
                                    title='Entities'
                                    id='bb-navbar-dropdown-entities'
                                    className='bb-navbar-dropdown'
                                >
                                    <LinkContainer to='/employees/new'>
                                        <NavDropdown.Item>
                                            Create new
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <LinkContainer to='/employees/search'>
                                        <NavDropdown.Item>
                                            Search
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                                <LinkContainer to='/deals'>
                                    <Nav.Link>Deals</Nav.Link>
                                </LinkContainer>
                                <LinkContainer to='/ledger'>
                                    <Nav.Link>Ledger</Nav.Link>
                                </LinkContainer>
                            </>
                        )}
                    </Nav>
                    <Nav className='bb-navbar-nav login-profile'>
                        {!currentUser && (
                            <LinkContainer to='/login'>
                                <Nav.Link>Login</Nav.Link>
                            </LinkContainer>
                        )}
                        {currentUser && (
                            <>
                                <Image
                                    roundedCircle
                                    src={
                                        currentUser?.profilePicUrl
                                            ? `${EMPLOYEE_PROFILE_DOWNLOAD.replace(
                                                  ':id',
                                                  currentUser._id
                                              )}`
                                            : `${process.env.PUBLIC_URL}/assets/default_avatar.jpeg`
                                    }
                                    style={{ maxWidth: '3rem' }}
                                />
                                <NavDropdown
                                    title={currentUser.fullName}
                                    id='bb-navbar-dropdown-profile'
                                    className='bb-navbar-dropdown'
                                >
                                    <LinkContainer
                                        to={`/employees/${currentUser._id}/profile`}
                                    >
                                        <NavDropdown.Item>
                                            Settings
                                        </NavDropdown.Item>
                                    </LinkContainer>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item onClick={onLogout}>
                                        Logout
                                    </NavDropdown.Item>
                                </NavDropdown>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default BBNavbar
