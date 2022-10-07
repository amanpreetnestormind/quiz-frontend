import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * 
 * @param {*} name 
 * @returns 
 * @method getToken
 * @description for getting data from async storage in mobile
 */

export const getToken = async (name) => {
    try {
        const response = await AsyncStorage.getItem(name)
        return response != null ? JSON.parse(response) : null
    } catch (error) {
        return error
    }
}

/**
 * @method removeItemValue
 * @description for logout functionality and for removing item from async storage 
 * @param {*} key 
 * @param {*} navigate 
 * @returns 
 */
export const removeItemValue = async (key, navigate) => {
    try {
        await AsyncStorage.removeItem(key);
        navigate('login')
        return true;
    }
    catch (exception) {
        return false;
    }
}

/** 
 * @param {*} name 
 * @param {*} token 
 * @method saveToken
 * @description for storing data in mobile's async storage
 */

export const saveToken = async (name, token) => {
    try {
        await AsyncStorage.setItem(name, JSON.stringify(token))
    } catch (error) {
        console.log(error);
    }
}

/**
 * @method replaceString
 * @description used to replace hexa codes from string
 * @param {*} str 
 * @returns 
 */

export const replaceString = (str) => {
    const start = str.indexOf("&");
    const end = str.indexOf(";");
    const changeStr = str.slice(start, end + 1);
    const changedStr = str.replace(changeStr, "");
    if (changedStr.indexOf("&") > 0) {
        return replaceString(changedStr);
    }
    return changedStr;
};