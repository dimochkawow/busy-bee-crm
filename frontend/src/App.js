import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { useSelector, useDispatch } from 'react-redux'
import { dismiss } from './store/notificationSlice'
import BBNavbar from './components/BBNavbar'
import BBFooter from './components/BBFooter'
import BBMessage from './components/BBMessage'
import Customers from './screens/Customers'
import EnrollEmployee from './screens/EnrollEmployee'
import SearchEmployee from './screens/SearchEmployee'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'

function App() {
    const dispatch = useDispatch()
    const { message } = useSelector((state) => state.notification)

    useEffect(() => {
        if (message.text) {
            setTimeout(() => {
                dispatch(dismiss())
            }, 3000)
        }
    }, [message, dispatch])

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
                        <Route path='/login' element={<Login />} />
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/customers' element={<Customers />} />
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
