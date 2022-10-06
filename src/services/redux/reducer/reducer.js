import { GET_QUESTION, LOGIN_USER_WITH_FACEBOOK, LOGIN_USER_WITH_GOOGLE, UESR_REGISTER_AND_LOGIN } from "../store/constants"

const initialState = {
    question: "",
    registerAndLogin: {}
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
        default: {
            return state
        }
    }
}

export default reducer