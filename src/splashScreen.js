import React, { useEffect, useState } from 'react'
import { View, SafeAreaView, Image, ImageBackground, Text, StatusBar, Dimensions, Platform, StyleSheet } from 'react-native'
import colors from '../theme/colors'
import { getToken } from './services/common_functions'
// import * as Font from 'expo-font'

const SplashScreen = ({ navigation }) => {
    const [isOpen, setIsOpen] = useState(true)

    // const LoadFonts = async () => {
    //     await Font.loadAsync({
    //         Jura: require('../assets/fonts/Jura-VariableFont_wght.ttf')
    //     })
    // };

    // useEffect(() => {
    //     LoadFonts()
    // }, [])

    useEffect(() => {
        if (isOpen) {
            setTimeout(async () => {
                const res = await getToken("quiz_app.user")
                if (res) {
                    navigation.navigate('confirmation_window')
                }
                else {
                    navigation.navigate("login")
                }
                setIsOpen(false)
            }, 5000)
        }
    }, [isOpen])

    return <ImageBackground
        source={require('../assets/background.png')}
        style={styles['main-container']}>
        <StatusBar hidden={true} />
        {/* <ImageBackground source={require('../assets/images/gridBackground.png')} style={styles['background-image']}>
        </ImageBackground> */}

        {/* <View style={styles['center-container']}>
            <View style={styles['circle-container']}>
                <View>
                    <Text style={styles['circle-text']}>Quiz</Text>
                    <Text style={styles['circle-time-text']}> Time</Text>
                </View>
            </View>
        </View> */}
        {/* <ImageBackground source={require('../assets/background.png')} style={{
            flex: 1
        }}> */}
        <Image source={require('../assets/logo.png')}
            height="100%"
            width="100%"
            style={{
                resizeMode: "cover"
            }}
        />
        <View style={styles.footer}>
            <Text style={styles['footer-inner']}>Powered by :</Text>
            <Image source={require('../assets/nestormindWhiteLogo.png')} style={styles['logo-image']} />
        </View>
        {/* <Image source={require('../assets/images/gridBackground.png')} style={{
            resizeMode: "cover",
            width,
            height,
        }} /> */}
        {/* </View> */}
    </ImageBackground>
}

export default SplashScreen

const { height, width } = Dimensions.get("screen")
const styles = StyleSheet.create({
    "main-container": {
        flex: 1,
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: colors.primary,
    },
    "background-image": {
        resizeMode: "cover",
        width,
        height,
    },
    "center-container": {
        borderWidth: 2,
        borderColor: "#fff",
        height: "40%",
        width: "80%",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 80,
        padding: "10%",
        backgroundColor: "#78787889"
    },
    "circle-container": {
        borderWidth: 2,
        borderColor: colors.border.primary,
        width: "100%",
        height: "100%",
        borderRadius: 300,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: 'rgba(255, 255, 255, 0.35)',
        shadowOffset: {
            height: 5,
            width: 5
        },
        shadowOpacity: 1,
        backgroundColor: colors.primary
        // textShadowOffset: { width: 10, height: 3 },
        // textShadowRadius: 15,
    },
    "circle-text": {
        color: colors.text.primary,
        fontSize: Platform.OS === "ios" ? 80 : 60,
        position: "relative",
        textShadowColor: 'rgba(255, 255, 255, 0.35)',
        textShadowOffset: Platform.OS === 'ios' ? { width: -1, height: -1 } : { width: 5, height: 3 },
        // textShadowRadius: 15,
    },
    'circle-time-text': {
        position: "absolute",
        fontSize: 30,
        bottom: -20,
        right: -30,
        color: colors.text.primary,
        textShadowColor: 'rgba(255, 255, 255, 0.35)',
        textShadowOffset: Platform.OS === 'ios' ? { width: 10, height: 3 } : { width: 5, height: 3 },
        // textShadowRadius: 15,
    },
    'footer': {
        width: "100%",
        height: 60,
        position: "absolute",
        bottom: 20,
        justifyContent: "center",
        alignItems: "center",
        // display: "flex",
        // flexDirection: "row",
        justifyContent: "center",
    },
    'logo-image': {
        height: "50%",
        resizeMode: "contain",
        width: "40%",
        marginLeft: 2
    },
    'footer-inner': {
        color: colors.text.primary,
        fontSize: 14,
        letterSpacing: .5,
        // fontFamily: 'Jura'
    }
})