import { createSlice } from '@reduxjs/toolkit'
import employees from '../dummy/employees'

const loginSlice = createSlice({
    name: 'login',
    initialState: {
        currentUser: localStorage.getItem('currentUser') || null,
        error: '',
    },
    reducers: {
        login: (state, action) => {
            const email = action.payload.email
            const password = action.payload.password

            const user = employees.find((employee) => employee.email === email)

            if (user && user.password === password) {
                state.currentUser = user
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(state.currentUser)
                )
            } else {
                state.currentUser = null
                state.error =
                    'Employee is not found or credentials are incorrect'
            }
        },
        logout: (state) => {
            state.currentUser = null
            localStorage.removeItem('currentUser')
        },
    },
})

export const { login, logout } = loginSlice.actions
export default loginSlice
