import axios from "axios"
import api from "../../api"
import { saveToken } from "../../common_functions"
import { GET_QUESTION, UESR_REGISTER_AND_LOGIN } from "../store/constants"

export const getQuestion = () => dispatch => {
    axios.get(`https://opentdb.com/api.php?amount=10&category=27&type=multiple`)
        .then(response => {
            dispatch({
                type: GET_QUESTION,
                payload: response.data
            })
        })
        .catch(err => {
            dispatch({
                type: GET_QUESTION,
                payload: {
                    err,
                    data: null
                }
            })
        })
}

export const userRegisterAndLogin = (userData, navigate) => dispatch => {
    api.post('user', userData)
        .then(res => {
            console.log(res, "response");
            dispatch({
                type: UESR_REGISTER_AND_LOGIN,
                payload: res
            })
            saveToken('quiz_app.user', res)
            navigate('quiz_comp')
        })
        .catch(err => {
            console.log(err, 'error');
            dispatch({
                type: UESR_REGISTER_AND_LOGIN,
                payload: {
                    data: null,
                    err
                }
            })
        })
}