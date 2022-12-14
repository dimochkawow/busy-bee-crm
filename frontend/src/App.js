import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { dismiss, show } from './store/notificationSlice'
import { logout } from './store/authSlice'
import BBNavbar from './components/BBNavbar'
import BBFooter from './components/BBFooter'
import BBMessage from './components/BBMessage'
import Customers from './screens/Customers'
import EnrollEmployee from './screens/EnrollEmployee'
import SearchEmployee from './screens/SearchEmployee'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'
import EmployeeProfile from './screens/EmployeeProfile'

function App() {
    const dispatch = useDispatch()
    const location = useLocation()
    const { message } = useSelector((state) => state.notification)

    useEffect(() => {
        if (message.text) {
            setTimeout(() => {
                dispatch(dismiss())
            }, 3000)
        }
    }, [message, dispatch])

    useEffect(() => {
        const expiresAt = localStorage.getItem('expiresAt')
            ? Number(localStorage.getItem('expiresAt'))
            : -1

        if (new Date().getTime() > expiresAt) {
            dispatch(logout())
            dispatch(
                show({
                    type: 'error',
                    text: 'Your access token expired. Please re-login',
                })
            )
        }
    }, [location, dispatch])

    return (
        <>
            <BBNavbar />
            <main className='py-3'>
                <Container fluid>
                    {message.text && (
                        <BBMessage type={message.type}>
                            {message.text}
                        </BBMessage>
                    )}
                    <Routes>
                        <Route path='/login' element={<Login />} exact />
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/customers' element={<Customers />} />
                        <Route
                            path='/employees/:id/profile'
                            element={<EmployeeProfile />}
                        />
                        <Route
                            path='/employees/new'
                            element={<EnrollEmployee />}
                        />
                        <Route
                            path='/employees/search'
                            element={<SearchEmployee />}
                        />
                    </Routes>
                </Container>
            </main>
            <BBFooter />
        </>
    )
}

export default App
