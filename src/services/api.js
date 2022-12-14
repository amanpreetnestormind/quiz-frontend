import axios from 'axios'
import { PORT, NODE_ENV, REACT_APP_API_URL, REACT_APP_FACEBOOK_ID } from '@env'
/**
 * @description this file is for Axios Interceptor
 */

const api = axios.create({
    // baseURL: NODE_ENV == 'development' ? `http://localhost:${PORT}/api/v1/` : `https://<domain_name>.com/api/v1/`,
    baseURL: "https://protected-gorge-56773.herokuapp.com/api/v1/",
})

// Request Interceptor
api.interceptors.request.use((config) => {
    // console.log("request ", config);
    return config
}, (error) => {
    // console.log("request request ", error);
    return Promise.reject(error)
})

// Response Interceptor
api.interceptors.response.use((response) => {
    // console.log("response ", response);
    return response.data
}, (error) => {
    // console.log("response error ", error);
    return Promise.reject(error)
})
export default api