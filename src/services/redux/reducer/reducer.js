import { GET_QUESTION, GET_TODAYS_QUOTE, LOGIN_USER_WITH_FACEBOOK, LOGIN_USER_WITH_GOOGLE, UESR_REGISTER_AND_LOGIN } from "../store/constants"

const initialState = {
    question: "",
    registerAndLogin: {},
    quote: ""
}

const reducer = (state = initialState, actions) => {
    const { type, payload } = actions
    switch (type) {
        case UESR_REGISTER_AND_LOGIN: {
            return {
                ...state,
                registerAndLogin: payload
            }
        }

        case GET_QUESTION: {
            return {
                ...state,
                question: payload
            }
        }
        case GET_TODAYS_QUOTE: {
            return {
                ...state,
                quote: payload
            }
        }
        default: {
            return state
        }
    }
}

export default reducer