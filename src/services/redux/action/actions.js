import axios from "axios"
import api from "../../api"
import { saveToken } from "../../common_functions"
import { GET_QUESTION, GET_TODAYS_QUOTE, UESR_REGISTER_AND_LOGIN } from "../store/constants"

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

export const userRegisterAndLogin = (userData, navigate, setIsFacebookLoading) => dispatch => {
    api.post('user', userData)
        .then(res => {
            dispatch({
                type: UESR_REGISTER_AND_LOGIN,
                payload: res
            })
            setIsFacebookLoading(false)
            saveToken('quiz_app.user', res)
            navigate('confirmation_window')
        })
        .catch(err => {
            setIsFacebookLoading(false)
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

export const getTodaysQuote = () => dispatch => {
    axios.get("https://icanhazdadjoke.com/slack")
    // axios.get('https://favqs.com/api/qotd')
        .then(res => {
            dispatch({
                type: GET_TODAYS_QUOTE,
                payload: res.data
            })
        })
        .catch(err => {
            dispatch({
                type: GET_TODAYS_QUOTE,
                payload: {
                    err,
                    data: null
                }
            })
        })
}