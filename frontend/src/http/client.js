import axios from 'axios'

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('currentUser'))
}

const instance = axios.create()

instance.interceptors.request.use(
    (req) => {
        req.headers['Authorization'] = `Bearer ${getCurrentUser()?.token}`
        return req
    },
    (err) => {
        return Promise.reject(err)
    }
)

export default instance
