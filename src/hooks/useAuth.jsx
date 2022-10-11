import React, { useEffect, useState } from 'react'
import { getToken, removeItemValue } from '../services/common_functions'
import jwtDecode from 'jwt-decode'
import { useNavigation } from '@react-navigation/native'

const useAuth = () => {
    const { navigate } = useNavigation()
    const [signInUser, setSignInUser] = useState("")

    const getUser = async () => {
        const res = await getToken("quiz_app.user")
        setSignInUser(res)
        return res
    }

    const logoutUser = async () => {
        const res = await removeItemValue("quiz_app.user")
        setSignInUser(res)
        navigate('login')
        return res
    }

    useEffect(() => {
        getUser()
        // console.log(jwtDecode(signInUser?.data?.token||""));
    }, [])

    return [signInUser, getUser, logoutUser]
}

export default useAuth