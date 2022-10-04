import { createSlice } from '@reduxjs/toolkit'

const cropSlice = createSlice({
    name: 'crop',
    initialState: {
        base64Image: '',
        imageFile: '',
    },
    reducers: {
        crop: (state, action) => {
            state.croppedImage = action.payload.base64
            state.imageFile = action.payload.imageFile
        },
    },
})

export const { crop } = cropSlice.actions
export default cropSlice
