import { createSlice } from '@reduxjs/toolkit'

const emptyMessage = {
    type: '',
    text: '',
}

const notificationSlice = createSlice({
    name: 'notification',
    initialState: {
        message: emptyMessage,
    },
    reducers: {
        show: (state, action) => {
            state.message = action.payload
        },
        dismiss: (state) => {
            state.message = emptyMessage
        },
    },
})

export const { show, dismiss } = notificationSlice.actions
export default notificationSlice
