import { show } from './notificationSlice'

export const handleError = (reject, dispatch, err) => {
    dispatch(
        show({
            type: 'error',
            text: err,
        })
    )
    return reject(err)
}

export const handleSuccess = (dispatch, successText, data) => {
    dispatch(
        show({
            type: 'info',
            text: successText,
        })
    )
    return data
}
