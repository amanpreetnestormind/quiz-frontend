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
 * 
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
