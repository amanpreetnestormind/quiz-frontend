import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { userRegisterAndLogin } from '../services/redux/action/actions'

const useAuth = () => {
    const [userData, setUserData] = useState({
        "userEmail": "amanpr1023@gmial.com",
        "facebookId": "12346",
        "googleId": "456789000000",
        "userName": "Preet Singh"
    })
    const dispatch = useDispatch()
    const selector = useSelector(_ => _.reducer)

    const userLogin = (user) => {
        dispatch(userRegisterAndLogin(user))
    }

    return [userLogin]
}

export default useAuth