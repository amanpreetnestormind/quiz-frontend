import React, { useEffect, useState } from 'react'
import { getToken, removeItemValue } from '../services/common_functions'

const useAuth = () => {

    const [signInUser, setSignInUser] = useState("")

    const getUser = async () => {
        const res = await getToken("quiz_app.user")
        setSignInUser(res)
        return res
    }

    const logoutUser = async () => {
        const res = await removeItemValue("quiz_app.user")
        setSignInUser(res)
        return res
    }

    useEffect(() => {
        getUser()
    }, [])

    return [signInUser, getUser, logoutUser]
}

export default useAuth