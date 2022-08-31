import { Route, Routes } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import BBNavbar from './components/BBNavbar'
import BBFooter from './components/BBFooter'
import Customers from './screens/Customers'
import Employees from './screens/Employees'
import Dashboard from './screens/Dashboard'
import Login from './screens/Login'

function App() {
    return (
        <>
            <BBNavbar />
            <main className='py-3'>
                <Container fluid>
                    <Routes>
                        <Route path='/login' element={<Login />} />
                        <Route path='/' element={<Dashboard />} />
                        <Route path='/customers' element={<Customers />} />
                        <Route path='/employees' element={<Employees />} />
                    </Routes>
                </Container>
            </main>
            <BBFooter />
        </>
    )
}

export default App
