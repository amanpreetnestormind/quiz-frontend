import React, { useEffect, useCallback, useState } from 'react'
import { Platform } from 'react-native'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../../theme/colors'
import useAuth from '../../hooks/useAuth'

const Confirmation = ({ navigation: { navigate } }) => {
    // const [isSignedIn, loginUser, logoutUser] = useAuth()
    // console.log(isSignedIn);

    return (<View style={{ flex: 1 }}>
        <ImageBackground
            source={require("../../../assets/background.png")}
            style={[styles['main-container']]}>
            <View style={[styles['inner-container']]}>
                <View style={[
                    styles['image-container']
                ]}>
                    <Image source={require("../../../assets/robinCartoon.png")} style={[styles.image]} />
                    <Text style={[styles['profile-name']]}>Robin Sharma</Text>
                </View>
                <View style={[styles['text-container']]}>
                    <Text style={[styles['welcome-text']]}>
                        <Text style={{
                            fontWeight: "bold"
                        }}>Trust yourself</Text> you know more than you think you do.
                    </Text>
                </View>
                <View style={[styles['button-container']]}>
                    <TouchableOpacity style={[styles['cancel-button']]}
                        onPress={() => {
                            // logoutUser()
                        }}>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <Image source={require('../../../assets/logout.png')} style={{
                                marginRight: 6,
                                height: 25,
                                width: 25,
                            }} />
                            <Text style={[styles['cancel-text']]}>Not Now</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={[styles['start-button']]} onPress={() => {
                        navigate('quiz_comp')
                    }}>
                        <Text style={[styles['start-text']]}>Let's Begin</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </ImageBackground>
    </View>)
}

export default Confirmation

const styles = StyleSheet.create({
    'main-container': {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 30
    },
    'inner-container': {
        flex: 1,
    },
    'image-container': {
        width: "100%",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    'text-container': {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    'welcome-text': {
        textAlign: "center",
        color: colors.text.primary,
        // fontFamily: "Jura",
        fontSize: 15,
        fontWeight: "500",
        letterSpacing: .4,
        lineHeight: 30
    },
    'profile-name': {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: Platform.OS == "ios" ? '600' : "600",
        // fontFamily: "Jura",
        marginTop: 10,
        minWidth: 200,
        textAlign: "center",
        letterSpacing: .4,
        lineHeight:30
    },
    image: {
        width: Platform.OS == "android" ? "50%" : "50%",
        height: Platform.OS == "android" ? "65%" : "50%",
        borderRadius: Platform.OS == "android" ? 100 : 300,
        overflow: "hidden"
    },
    'button-container': {
        width: "100%",
        flex: .5,
        alignItems: "flex-end",
        display: "flex",
        flexDirection: "row"
    },
    'cancel-button': {
        height: 50,
        width: "50%",
        borderRadius: 50,
        justifyContent: "center",
        alignItems: "center",
    },
    'start-button': {
        height: 50,
        borderWidth: 1,
        borderColor: colors.buttons.primary.background,
        width: "50%",
        // marginBottom: 20,
        borderRadius: 50,
        backgroundColor: colors.buttons.primary.background,
        justifyContent: "center",
        alignItems: "center"
    },
    'start-text': {
        color: colors.text.primary,
        fontSize: 18,
        letterSpacing: .4,
        width: 200,
        textAlign: "center",
        // fontFamily: "Jura"
        fontWeight:"500"
    },
    'cancel-text': {
        textAlign: "center",
        // fontFamily: "Jura",
        color: "#909090",
        fontSize: 18,
        letterSpacing: .4,
        width: 100
    }
})