import axios from '../http/client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { LOGIN, REGISTER_EMPLOYEE } from '../http/urls'
import { handleSuccess, handleError } from './commonHandlers'

export const login = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue, dispatch }) => {
        const loginForm = new FormData()
        loginForm.append('username', credentials.email)
        loginForm.append('password', credentials.password)

        try {
            const response = await axios.post(LOGIN, loginForm, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            return response.data
        } catch (e) {
            return handleError(
                rejectWithValue,
                dispatch,
                e.response.data.detail
            )
        }
    }
)

export const register = createAsyncThunk(
    'auth/register',
    async (employee, { rejectWithValue, dispatch }) => {
        try {
            const response = await axios.post(REGISTER_EMPLOYEE, employee)
            const newEmployee = response.data
            return handleSuccess(
                dispatch,
                `${newEmployee.fullName} has been just enrolled!`,
                newEmployee
            )
        } catch (e) {
            return handleError(
                rejectWithValue,
                dispatch,
                e.response.data.detail
            )
        }
    }
)

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        currentUser: JSON.parse(localStorage.getItem('currentUser')) || null,
        loading: false,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('currentUser')
            state.currentUser = null
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false
                state.currentUser = action.payload
                localStorage.setItem(
                    'expiresAt',
                    new Date().getTime() + action.payload.expiresIn * 1000
                )
                localStorage.setItem(
                    'currentUser',
                    JSON.stringify(action.payload)
                )
            })
            .addCase(login.rejected, (state) => {
                state.loading = false
            })
            .addCase(register.pending, (state) => {
                state.loading = true
            })
            .addCase(register.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(register.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice
