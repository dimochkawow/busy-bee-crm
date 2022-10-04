import { configureStore } from '@reduxjs/toolkit'
import authSlice from './authSlice'
import cropSlice from './cropSlice'
import notificationSlice from './notificationSlice'
import employeeSlice from './employeeSlice'

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        crop: cropSlice.reducer,
        notification: notificationSlice.reducer,
        employee: employeeSlice.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['crop/crop'],
                ignoredPaths: ['crop.imageFile'],
            },
        }),
})
