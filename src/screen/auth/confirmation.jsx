import React, { useEffect, useCallback, useState } from 'react'
import { Platform, Pressable } from 'react-native'
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import colors from '../../../theme/colors'
import useAuth from '../../hooks/useAuth'
import * as Font from 'expo-font'
import { Alert } from 'react-native'
import { useDispatch } from 'react-redux'
import { getQuestion } from '../../services/redux/action/actions'
import { useSelector } from 'react-redux'
import { useNavigation } from '@react-navigation/native'

const Confirmation = () => {
    const navigation = useNavigation()
    const { navigate } = navigation
    const [isSignedIn, loginUser, logoutUser] = useAuth()
    const dispatch = useDispatch()
    const selector = useSelector(_ => _)
    const [totalCount, setTotalCount] = useState(0)

    const LoadFont = async () => {
        await Font.loadAsync({
            "Poppins": { uri: "https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" }
        })
    }
    const confirmationModal = () =>
        Alert.alert('Warning', 'Are you sure, You want to logout ?', [
            {
                text: 'Deny',
                onPress: () => console.log('Cancel Pressed'),
                style: 'Deny',
            },
            {
                text: 'Allow', onPress: () => {
                    navigate('login')
                }
            },
        ]);

    useEffect(() => {
        LoadFont()
        dispatch(getQuestion())
    }, [])

    useEffect(() => {
        setTotalCount(selector?.reducer?.question?.results?.length)
    }, [selector])

    return (<View style={{ flex: 1 }}>
        <ImageBackground
            source={require("../../../assets/background.png")}
            style={[styles['main-container']]}>
            <View style={[styles['inner-container']]}>
                <View style={[
                    styles['image-container']
                ]}>
                    <View
                        style={{
                            alignItems: "center",
                            height: 150,
                            width: 150,
                            borderRadius: Platform.OS == "ios" ? 100 : 300,
                            borderWidth: 2,
                            borderColor: "#06D3F6"
                        }}>

                        <Image
                            source={isSignedIn?.data?.picture?.data?.url ? { uri: isSignedIn?.data?.picture?.data?.url } : require("../../../assets/user.png")}
                            style={[
                                // styles.image,
                                {
                                    resizeMode: "cover",
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: Platform.OS == "ios" ? 100 : 300,
                                    borderWidth: 2,
                                    borderColor: "#06D3F6",
                                    alignSelf: "center"
                                }
                            ]}
                        />
                    </View>
                    <Text style={[styles['profile-name']]}>{isSignedIn?.data?.userName}</Text>
                </View>
                <View style={[styles['text-container']]}>
                    <Text style={[styles['welcome-text']]}>
                        <Text style={{
                            fontWeight: "bold"
                        }}>Trust yourself</Text> you know more than you think you do.
                    </Text>
                </View>

                <View style={styles['buttonContainer']}>
                    <View
                        style={[
                            {
                                paddingLeft: 5,
                                paddingRight: 5
                            },
                        ]}>
                        <TouchableOpacity
                            style={{
                                ...styles.quit
                            }}
                            onPress={() => {
                                confirmationModal()
                            }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Image source={require('../../../assets/logout.png')} style={{
                                    marginRight: 6,
                                    height: 20,
                                    width: 20
                                }} />
                                <Text style={styles['quit-text']}>Not Now</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            {
                                paddingLeft: 5,
                                paddingRight: 5
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={{
                                ...styles.next,
                                backgroundColor: colors.buttons.primary.background,
                                borderColor: colors.buttons.primary.background
                            }}
                            onPress={() => {
                                navigate('quiz_comp')
                            }}
                            disabled={totalCount == 0}
                        >
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Text style={styles.nextText}>Let's Begin</Text>
                                <Image source={require('../../../assets/rightIcon.png')} style={{
                                    height: 10,
                                    width: 15
                                }} />
                            </View>
                        </TouchableOpacity>
                    </View>

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
        fontFamily: "Poppins",
        fontSize: 15,
        fontWeight: "500",
        letterSpacing: .4,
        lineHeight: 30
    },
    'profile-name': {
        color: colors.text.primary,
        fontSize: 20,
        fontWeight: Platform.OS == "ios" ? '600' : "600",
        fontFamily: "Poppins",
        marginTop: 10,
        minWidth: 200,
        textAlign: "center",
        letterSpacing: .4,
        lineHeight: 30
    },
    image: {
        width: Platform.OS == "android" ? "50%" : "50%",
        height: Platform.OS == "android" ? "65%" : "53%",
        borderRadius: Platform.OS == "android" ? 100 : 300,
        overflow: "hidden"
    },
    'button-container': {
        width: "100%",
        flex: .5,
        alignItems: "flex-end",
        display: "flex",
        flexDirection: "row",
    },
    'inner-button': {
        // borderWidth: 1,
        // borderColor: "#fff",
        width: "50%",
    },
    'cancel-button': {
        height: 45,
        // width: "50%",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
    },
    'start-button': {
        borderRadius: 10,
        height: 45,
        borderWidth: 1,
        borderColor: colors.buttons.primary.background,
        backgroundColor: colors.buttons.primary.background,
        // paddingRight: 10,
        // paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    'start-text': {
        color: colors.text.primary,
        fontSize: 18,
        letterSpacing: .4,
        fontWeight: "400",
        textAlign: "center",
        fontFamily: "Poppins"
    },
    'cancel-text': {
        textAlign: "center",
        fontFamily: "Poppins",
        color: "#909090",
        fontSize: 16,
        letterSpacing: .4,
    },
    'buttonContainer': {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    next: {
        borderRadius: 10,
        height: 45,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    nextText: {
        color: colors.text.primary,
        fontSize: 18,
        letterSpacing: .4,
        fontWeight: "400",
        textAlign: "center",
        fontFamily: "Poppins",
        lineHeight: 48,
        marginRight: 10
    },
    quit: {
        borderRadius: 50,
        height: 45,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
    },
    'quit-text': {
        color: "#909090",
        fontSize: 14,
        letterSpacing: .4,
        fontFamily: "Poppins"
    },
})