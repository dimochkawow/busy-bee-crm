import axios from 'axios'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { show } from './notificationSlice'
import { LOGIN, REGISTER_EMPLOYEE } from '../http/urls'

// export const updateLastLoginTime = createAsyncThunk(
//     'auth/updateLastLoginTime',
//     async (id, { getState }) => {
//         const date = new Date().toISOString().split('.')[0].replace('T', ' ')
//         const currentUser = getState().auth.currentUser
//         await axios.patch(
//             `${EMPLOYEES_BASE}/${id}`,
//             {
//                 lastLoginAt: date,
//             },
//             {
//                 headers: {
//                     Authorization: `Bearer ${currentUser.token}`,
//                 },
//             }
//         )
//     }
// )

const handleError = (reject, dispatch, err) => {
    dispatch(
        show({
            type: 'error',
            text: err,
        })
    )
    return reject(err)
}

const handleSuccess = (dispatch, successText, data) => {
    dispatch(
        show({
            type: 'info',
            text: successText,
        })
    )
    return data
}

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
            state.currentUser = null
            localStorage.removeItem('currentUser')
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
                    'currentUser',
                    JSON.stringify(action.payload)
                )
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false
            })
            .addCase(register.pending, (state) => {
                state.loading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false
            })
    },
})

export const { logout } = authSlice.actions
export default authSlice
