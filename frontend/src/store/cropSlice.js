import { createSlice } from '@reduxjs/toolkit'

const cropSlice = createSlice({
    name: 'crop',
    initialState: {
        croppedImage: '',
    },
    reducers: {
        crop: (state, action) => {
            state.croppedImage = action.payload
        },
    },
})

export const { crop } = cropSlice.actions
export default cropSlice
