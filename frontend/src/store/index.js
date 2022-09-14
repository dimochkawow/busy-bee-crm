import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import cropSlice from './cropSlice'
import notificationSlice from './notificationSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        crop: cropSlice.reducer,
        notification: notificationSlice.reducer,
    },
})
