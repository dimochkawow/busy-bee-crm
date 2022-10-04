import axios from '../http/client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
    EMPLOYEE_PROFILE_UPLOAD,
    EMPLOYEE_UPDATE,
    EMPLOYEE_CHANGE_PASSWORD,
    SEARCH_EMPLOYEE_AUTOCOMPLETE,
} from '../http/urls'
import { handleSuccess, handleError } from './commonHandlers'

// export const fetchEmployee = createAsyncThunk(
//     'employee/fetchEmployee',
//     async (id, { rejectWithValue, dispatch }) => {
//         try {
//             const profileUrl = EMPLOYEE_PROFILE.replace(':id', id)
//             const response = await axios.get(profileUrl)
//             return response.data
//         } catch (e) {
//             return handleError(
//                 rejectWithValue,
//                 dispatch,
//                 e.response.data.detail
//             )
//         }
//     }
// )

export const updateEmployee = createAsyncThunk(
    'employee/updateEmployee',
    async (updatedEmployee, { rejectWithValue, dispatch }) => {
        try {
            const updateUrl = EMPLOYEE_UPDATE.replace(
                ':id',
                updatedEmployee._id
            )
            const response = await axios.patch(updateUrl, updatedEmployee)
            return handleSuccess(dispatch, `Changes saved`, response.data)
        } catch (e) {
            return handleError(
                rejectWithValue,
                dispatch,
                e.response.data.detail
            )
        }
    }
)

export const removeEmployee = createAsyncThunk(
    'employee/removeEmployee',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const removeUrl = EMPLOYEE_UPDATE.replace(':id', id)
            await axios.delete(removeUrl)
            return handleSuccess(
                dispatch,
                `Employee removed from database`,
                null
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

export const changePassword = createAsyncThunk(
    'employee/changePassword',
    async (payload, { rejectWithValue, dispatch }) => {
        try {
            const changePasswordUrl = EMPLOYEE_CHANGE_PASSWORD.replace(
                ':id',
                payload.id
            )
            await axios.post(changePasswordUrl, {
                oldPassword: payload.oldPassword,
                newPassword: payload.newPassword,
                confirmPassword: payload.confirmPassword,
            })
            return handleSuccess(
                dispatch,
                `Password changed successfully`,
                null
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

export const uploadProfileImage = createAsyncThunk(
    'employee/uploadProfileImage',
    async ({ id, imageFile }, { rejectWithValue, dispatch }) => {
        const uploadUrl = EMPLOYEE_PROFILE_UPLOAD.replace(':id', id)
        const formData = new FormData()
        formData.append('file', imageFile)

        try {
            const response = await axios.post(uploadUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })

            dispatch(
                updateEmployeeProfile({
                    profilePicUrl: response.data.profilePicUrl,
                })
            )

            return handleSuccess(
                dispatch,
                'Profile photo updated successfully',
                response.data
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

export const autocompleteSearch = createAsyncThunk(
    'employee/autocompleteSearch',
    async (query, { rejectWithValue, dispatch }) => {
        try {
            const url = SEARCH_EMPLOYEE_AUTOCOMPLETE.replace(':q', query)
            const response = await axios.get(url)
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

export const employeeSlice = createSlice({
    name: 'employee',
    initialState: {
        employeeProfile: null,
        loading: false,
        searchResults: [],
    },
    reducers: {
        updateEmployeeProfile: (state, action) => {
            state.employeeProfile = {
                ...state.employeeProfile,
                ...action.payload,
            }
        },
        clearSearchResults: (state) => {
            state.searchResults = []
        },
    },
    extraReducers(builder) {
        builder
            // .addCase(fetchEmployee.pending, (state) => {
            //     state.loading = true
            // })
            // .addCase(fetchEmployee.fulfilled, (state, action) => {
            //     state.loading = false
            //     state.employeeProfile = action.payload
            // })
            // .addCase(fetchEmployee.rejected, (state) => {
            //     state.loading = false
            // })
            .addCase(uploadProfileImage.pending, (state) => {
                state.loading = true
            })
            .addCase(uploadProfileImage.fulfilled, (state) => {
                state.loading = false
            })
            .addCase(uploadProfileImage.rejected, (state) => {
                state.loading = false
            })
            .addCase(updateEmployee.pending, (state) => {
                state.loading = true
            })
            .addCase(updateEmployee.fulfilled, (state, action) => {
                state.loading = false
                state.employeeProfile = action.payload
            })
            .addCase(updateEmployee.rejected, (state) => {
                state.loading = false
            })
            .addCase(removeEmployee.pending, (state) => {
                state.loading = true
            })
            .addCase(removeEmployee.rejected, (state) => {
                state.loading = false
            })
            .addCase(changePassword.pending, (state) => {
                state.loading = true
            })
            .addCase(changePassword.rejected, (state) => {
                state.loading = false
            })
            .addCase(autocompleteSearch.pending, (state) => {
                state.loading = true
            })
            .addCase(autocompleteSearch.fulfilled, (state, action) => {
                state.loading = false
                state.searchResults = action.payload
            })
            .addCase(autocompleteSearch.rejected, (state) => {
                state.loading = false
            })
    },
})

export const { updateEmployeeProfile, clearSearchResults } =
    employeeSlice.actions
export default employeeSlice
