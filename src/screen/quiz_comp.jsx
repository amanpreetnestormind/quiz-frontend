import React, { useEffect, useState } from 'react'
import { Text, View, ActivityIndicator, Animated, Image, ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Alert } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import colors from "../../theme/colors"
import { getToken, removeItemValue, replaceString } from '../services/common_functions'
import { getQuestion } from '../services/redux/action/actions'
import { AntDesign } from '@expo/vector-icons'
import useAuth from '../hooks/useAuth'
import * as Font from 'expo-font'
import { useNavigation } from '@react-navigation/native'
import { showMessage, hideMessage } from "react-native-flash-message";

const Quiz_comp = () => {
    const navigation = useNavigation()
    const { navigate } = navigation
    const [isSignedIn, isLoginUser, logoutUser] = useAuth()

    const confirmationModal = () =>
        Alert.alert('Warning', 'Are you sure, You want to Leave Quiz ?', [
            {
                text: 'Deny',
                onPress: () => console.log('Deny Pressed'),
                style: 'Deny',
            },
            {
                text: 'Allow', onPress: () => {
                    navigate("confirmation_window")
                }
            },
        ]);

    // const LoadFonts = async () => {
    //     await Font.loadAsync({
    //         "Jura": require('../../assets/fonts/Jura-VariableFont_wght.ttf')
    //     })
    // };

    const LoadFonts = async () => {
        await Font.loadAsync({
            "Poppins": require("../../assets/fonts/Poppins-Medium.ttf")
            // "Poppins": { uri: "https://fonts.googleapis.com/css2?family=Poppins:wght@500&display=swap" }
        })
    };

    const [animationState, setAnimationState] = useState({
        ready: false,
        SlideInLeft: new Animated.Value(0),
        slideUpValue: new Animated.Value(0),
        fadeValue: new Animated.Value(0)
    })
    const AnimatedClick = Animated.createAnimatedComponent(TouchableOpacity)
    const dispatch = useDispatch()
    const selector = useSelector(state => state)
    const [totalCount, setTotalCount] = useState(0)
    const [questions, setQuestions] = useState([])
    const [currentIndex, setCurrentIndex] = useState(11)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [isRestartLoading, setIsRestartLoading] = useState(false)
    const [isNext, setIsNext] = useState(true)
    const [output, setOutput] = useState({
        count: 0,
        selectedAnswer: "",
        wrongAnswer: false
    })
    const [isRestart, setIsRestart] = useState(false)
    let answer = {
        correctAnswer: ""
    }
    const [answerSubmit, setAnswerSubmit] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [style, setStyle] = useState(false)
    const [isBlinking, setIsBlinking] = useState(false)
    const [blinkingInterval, setBlinkingInterval] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(2)
    const [skipCount, setSkipCount] = useState(0)

    useEffect(() => {
        // dispatch(getQuestion())
        LoadFonts()
        if (!blinkingInterval) {
            setBlinkingInterval(setInterval(() => {
                setIsBlinking(!isBlinking);
            }, 800));
        }

        // navigation.addListener('beforeRemove', (e) => {
        //     e.preventDefault();
        //     return
        // })
    }, [])

    useEffect(() => {
        setTotalCount(selector?.reducer?.question?.results?.length)
        setQuestions(selector?.reducer?.question?.results)
    }, [selector])

    useEffect(() => {
        if (isRestart) {
        }
        _start()
        if (isLoading) {
            dispatch(getQuestion())
            setTimeout(() => {
                setCurrentIndex(1)
                setOutput({
                    ...output,
                    count: 0
                })
                setCorrectAnswerCount(0)
                setIsRestart(false)
                setIsLoading(false)
                // setIsRestartLoading(false)
            }, 4000)
        }
    }, [isRestart, isRestartLoading])

    const _start = () => {
        return Animated.parallel([
            Animated.timing(animationState.slideUpValue, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true
            })
        ]).start();
    }

    return <View style={[styles["main-container"]]}>
        {isLoading && <View style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1
        }}>
            <ActivityIndicator color="#fff" size="large" />
        </View>}
        {!isLoading && <View style={{
            backgroundColor: colors.primary,
        }}>
            <StatusBar barStyle="light-content" hidden={false} />
            <View
                style={[
                    styles['card-container']
                ]}>
                <Image
                    source={isSignedIn?.data?.picture?.data?.url ? { uri: isSignedIn?.data?.picture?.data?.url } : require("../../assets/user.png")}
                    style={[styles['card-image']]} />
                <Text style={[styles['card-name-text']]}>{isSignedIn?.data?.userName || ""}</Text>
                {/* <Image
                    source={require('../../assets/robinCartoon.png')}
                    style={[
                        styles['card-image']
                    ]} />
                <Text
                    style={[styles['card-name-text']]}>Robin Sharma</Text> */}
            </View>
        </View>}
        {!isLoading && currentIndex <= 10 && <View style={[
            styles["top-bar"]
        ]}>
            <View style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between"
            }}>
                <Text style={styles['quiz-type']}>Animals Quiz</Text>
                <TouchableOpacity onPress={() => {
                    if (skipCount < 3) {
                        setSkipCount(skipCount + 1)
                        setCurrentIndex(currentIndex + 1)
                    } else {
                        showMessage({
                            message: "You can skip only 3 questions!",
                            icon: {
                                position: "right",
                                icon: "warning"
                            },
                            backgroundColor: colors.buttons.primary.background
                        })
                    }
                }}>
                    <Text style={[styles['quiz-type'], { color: "#909090" }]}>Skip</Text>
                </TouchableOpacity>
            </View>
            <Text style={[
                styles['question-title']
            ]}>Question
                <Text style={[
                    styles['question-number']
                ]}> {currentIndex}/10</Text>
            </Text>
        </View>}

        {!isLoading && currentIndex <= 10 && <Animated.View style={[
            styles['question-container'],
            {
                // transform: [
                //     {
                //         translateX: animationState.slideUpValue.interpolate({
                //             inputRange: [0, 1],
                //             outputRange: [-600, 0]
                //         })
                //     }
                // ]
            }
        ]}>
            {questions?.map((question, index) => {

                function getRandomInt(max) {
                    return Math.floor(Math.random() * max);
                }
                const result = question.incorrect_answers?.filter((ans) => (ans.includes(question.correct_answer)))
                if (result.length <= 0) {
                    question.incorrect_answers.splice(getRandomInt(4), 0, question.correct_answer)
                }

                if (index + 1 == currentIndex) {
                    answer.correctAnswer = question.correct_answer
                    return <View key={index} style={{
                        width: "100%"
                    }}>
                        <Text style={[
                            isBlinking && styles.textGlowing
                        ]}>{replaceString(question?.question)}</Text>
                        <View style={styles.answerContainer}>
                            {question.incorrect_answers?.map((ans, i) => (<AnimatedClick
                                disabled={answerSubmit}
                                key={i}
                                style={[
                                    selectedIndex === i ?
                                        output.wrongAnswer ? {
                                            ...styles.answerButton,
                                            backgroundColor: output.wrongAnswer ? "red" : "",
                                            borderColor: output.wrongAnswer ? "red" : ""
                                        } : {
                                            ...styles.answerButton,
                                            backgroundColor: output.wrongAnswer ? "red" : colors.primary,
                                            borderColor: output.wrongAnswer ? "red" : colors.buttons.primary.background
                                        } :
                                        { ...styles.answerButton },
                                    answer.correctAnswer === ans && style == true ? {
                                        ...styles.answerButton,
                                        ...styles.correctAnswer
                                    } : {}
                                ]}
                                onPress={() => {
                                    setOutput({
                                        ...output,
                                        selectedAnswer: ans
                                    })
                                    setSelectedIndex(i)
                                    setIsNext(false)
                                }}
                            >
                                <Text style={[
                                    selectedIndex === i ?
                                        {
                                            ...styles.answerText,
                                            ...styles.selectedText,
                                        } : { ...styles.answerText },
                                    answer.correctAnswer === ans && style == true ?
                                        {
                                            ...styles.answerText,
                                            ...styles.correctAnswer,
                                            color: colors.buttons.primary.background,
                                        } :
                                        {
                                            color: selectedIndex === i && !output.wrongAnswer ? colors.buttons.primary.background : colors.text.primary
                                        },
                                ]}>{replaceString(ans)}</Text>
                                <Text style={[
                                    selectedIndex === i ?
                                        styles['radio-icon-selected'] :
                                        styles['radio-icon-not-selected'],
                                    selectedIndex === i && output.wrongAnswer ? {
                                        backgroundColor: "#fff",
                                        borderColor: "#fff"
                                    } : {},
                                    {
                                        textAlign: "center"
                                    }
                                ]}>
                                    {selectedIndex === i && <AntDesign style={{
                                        alignSelf: "center"

                                    }} name="check" size={18} color={output.wrongAnswer ? "red" : "#fff"} />}
                                </Text>
                            </AnimatedClick>))}
                        </View>
                    </View>
                }
            })}
            {!isLoading && <View style={[styles['footer']]}>
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
                                ...styles.quit,
                                display: currentIndex > 10 ? "none" : "flex",
                            }}
                            onPress={() => {
                                confirmationModal()
                                // navigate('login')
                                // showMessage({
                                //     message: "Simple message",
                                //     type: "info",
                                //     icon: {position:"right",icon:"danger"},
                                // })
                            }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Image source={require('../../assets/logout.png')}
                                    style={{
                                        marginRight: 6,
                                        height: 20,
                                        width: 20
                                    }} />
                                <Text style={styles['quit-text']}>Quit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            {
                                paddingLeft: 5,
                                paddingRight: 5,
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={{
                                ...styles.next,
                                display: currentIndex > 10 ? "none" : "flex",
                                backgroundColor: isNext ? "#2B3047" : colors.buttons.primary.background,
                                borderColor: isNext ? "#2B3047" : colors.buttons.primary.background
                            }}
                            disabled={isNext}
                            onPress={() => {
                                if (answer.correctAnswer === output.selectedAnswer) {
                                    setOutput({
                                        ...output,
                                        count: output.count + 1,
                                    })
                                    setCorrectAnswerCount(oldState => {
                                        oldState = oldState + 1
                                        return oldState
                                    })
                                }
                                if (answer.correctAnswer != output.selectedAnswer) {
                                    setOutput({
                                        ...output,
                                        wrongAnswer: true
                                    })
                                }
                                // if (currentIndex == questions.length) setCurrentIndex(0)
                                setAnswerSubmit(true)
                                setIsNext(true)
                                setIsNext(true)
                                setStyle(false)
                                setSelectedIndex(null)
                                setAnswerSubmit(false)
                                // setIsLoading(true)
                                setOutput({
                                    ...output,
                                    wrongAnswer: false
                                })
                                setCurrentIndex(currentIndex + 1)
                            }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Text style={styles.nextText}>Next</Text>
                                <Image source={require('../../assets/rightIcon.png')} style={{
                                    height: 12,
                                    width: Platform.OS == "ios" ? 20 : 15
                                }} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>}
        </Animated.View>
        }

        {
            !isLoading && currentIndex >= 11 && <View style={styles['result-page']}>
                <View style={{
                    width: "60%",
                    height: "30%",
                    alignItems: "center",
                    justifyContent: "center"
                }}>
                    {correctAnswerCount <= 3 && <Image source={require('../../assets/images/sad.png')} style={{
                        height: 150,
                        width: 150,
                    }} />}
                    {correctAnswerCount > 3 && correctAnswerCount <= 5 && <Image source={require('../../assets/images/better.png')} style={{
                        height: 150,
                        width: 150,
                    }} />}
                    {correctAnswerCount >= 6 && correctAnswerCount <= 8 && <Image source={require('../../assets/images/medal.png')} style={{
                        height: 150,
                        width: 150,
                    }} />}
                    {correctAnswerCount > 8 && <Image source={require('../../assets/gold-cup.png')} style={{
                        height: 150,
                        width: 150,
                    }} />}
                </View>
                <View style={{
                    alignItems: "center",
                    marginTop: 0,
                }}>
                    <Text style={[
                        styles['result-page-title'],
                        {
                            fontSize: 30,
                            fontWeight: "bold",
                            marginTop: 10,
                            minWidth: 250,
                            textAlign: "center",
                            fontFamily: "Poppins"
                        }
                    ]}>{correctAnswerCount <= 3 ? "Better luck next time" : correctAnswerCount > 3 && correctAnswerCount <= 5 ? "Better" : correctAnswerCount >= 6 && correctAnswerCount <= 8 ? "Brelient" : "Expert"}</Text>
                    {/* Congratulation! */}
                    <Text style={[
                        styles['result-page-title'],
                        {
                            fontSize: 14,
                            marginTop: 0,
                            textAlign: "center",
                            letterSpacing: .5,
                            lineHeight: 25,
                            flexWrap: "wrap"
                        }
                    ]}>
                        Thank you! For putting in your precious time for the quiz. We hope you enjoyed and learned something new.
                    </Text>
                    <Text style={[
                        styles['result-page-title'],
                        {
                            fontSize: 20,
                            marginTop: 5,
                            textAlign: "center",
                            letterSpacing: .5,
                            lineHeight: 25,
                            textTransform: "uppercase",
                            color: "#FFD700",
                            width: 250
                        }
                    ]}>
                        your score
                    </Text>

                    <Text style={[
                        styles['result-page-title'],
                        {
                            fontSize: 50,
                            marginTop: 5,
                            textAlign: "center",
                            letterSpacing: .5,
                            textTransform: "uppercase",
                            width: 250
                        }
                    ]}>
                        <Text style={{
                            color: "#00DAFF",
                        }}>{correctAnswerCount}</Text>/10
                    </Text>
                </View>
            </View>
        }
        {
            !isLoading && currentIndex >= 11 && <View style={[styles['footer']]}>
                <View style={styles['buttonContainer']}>
                    <View
                        style={[{ paddingLeft: 5, paddingRight: 5 }]}>
                        <TouchableOpacity
                            style={{
                                ...styles.quit,
                                display: currentIndex <= 10 ? "none" : "flex",
                            }}
                            onPress={() => {
                                confirmationModal()
                            }}>
                            <View
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                <Image
                                    source={require('../../assets/logout.png')}
                                    style={{
                                        marginRight: 6,
                                        height: 20,
                                        width: 20
                                    }} />
                                <Text style={styles['quit-text']}>Quit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[{ paddingLeft: 5, paddingRight: 5 }]}
                    >
                        <TouchableOpacity style={{
                            ...styles.next,
                            borderColor: colors.buttons.primary.background,
                            // borderWidth: 1,
                            backgroundColor: colors.buttons.primary.background
                        }}
                            onPress={() => {
                                setIsRestart(true)
                                setIsLoading(true)
                            }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                alignItems: "center"
                            }}>
                                <Text style={{ ...styles.nextText }}>Start Again</Text>
                                {!isLoading && <Image source={require('../../assets/reload.png')} style={{
                                    height: 15,
                                    width: 15
                                }} />}
                                {isLoading && <ActivityIndicator size="small" color={"#fff"} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        }
    </View >
}

export default Quiz_comp

const styles = StyleSheet.create({
    'main-container': {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 10,
        position: "relative",
        paddingTop: 0,
        paddingBottom: 10
    },
    'top-bar': {},
    'question-title': {
        color: "#06D3F6",
        fontSize: 17,
        // fontWeight: "600",
        letterSpacing: .4,
        fontFamily: "Poppins"
    },
    'question-number': {
        fontSize: 18
    },
    'quiz-type': {
        color: "#FFD700",
        fontSize: 15,
        // fontWeight: "500",
        marginBottom: 10,
        fontFamily: "Poppins"
    },
    'question-container': {
        flex: 1,
        marginTop: 15,
        alignItems: "flex-start",
        height: "100%",
    },
    textGlowing: {
        // textShadowColor: 'rgba(255, 255, 255, 0.75)',
        // textShadowOffset: { width: -1, height: 1 },
        // textShadowRadius: 2,
        fontSize: 20,
        color: colors.text.primary,
        width: "100%",
        lineHeight: 30,
        minHeight: 100,
        // fontWeight: "800",
        letterSpacing: .5,
        fontFamily: "Poppins"
    },
    answerContainer: {
        display: "flex",
        justifyContent: "space-between",
        flexDirection: "column",
        flexWrap: "wrap",
        marginTop: 20
    },
    answerButton: {
        width: "100%",
        padding: 10,
        borderWidth: 1,
        borderRadius: 10,
        height: Platform.OS === "ios" ? 60 : 50,
        borderColor: "#fff",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        paddingLeft: 10,
        paddingRight: 10,
        alignItems: "center",
        marginBottom: 10,
        color: colors.buttons.primary.background
        // marginBottom: 8
    },
    answerText: {
        // color: colors.buttons.primary.background,
        fontSize: 16,
        fontFamily: "Poppins",
        fontWeight: '600',
        letterSpacing: 0.4,
        width: "80%",
        paddingLeft: 10
    },
    'radio-icon-selected': {
        color: colors.buttons.primary.background,
        width: 30,
        height: 30,
        // borderWidth: 1,
        // borderColor: colors.buttons.primary.background,
        borderRadius: 15,
        overflow: "hidden",
        backgroundColor: colors.buttons.primary.background,
        padding: 1,
        lineHeight: Platform.OS === "ios" ? 26 : 28,
        fontWeight: '800'
    },
    'radio-icon-not-selected': {
        color: colors.success,
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: "#fff",
        borderRadius: 15,
        overflow: "hidden"
    },
    selected: {
        backgroundColor: colors.buttons.primary.background
    },
    selectedText: {
        // color: "#00DAFF",
        fontSize: 17,
        fontWeight: "800",
        fontFamily: "Poppins"
    },
    correctAnswer: {
        backgroundColor: colors.text.primary,
        color: colors.text.primary,
        fontFamily: "Poppins"
    },
    footer: {
        position: "absolute",
        bottom: 0,
        height: "10%",
        width: "100%",
        alignSelf: "center"
    },
    'buttonContainer': {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    next: {
        height: 45,
        borderRadius: 10,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 10,
        paddingRight: 10,
    },
    nextText: {
        color: colors.text.primary,
        fontSize: 18,
        letterSpacing: .4,
        lineHeight: Platform.OS == "ios" ? 45 : 47,
        fontFamily: "Poppins",
        marginRight: 10,
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
        lineHeight: 45,
        fontFamily: "Poppins",
        borderColor: "#fff",
    },
    'result-page': {
        flex: 1,
        alignItems: "center",
        padding: 10,
    },
    'result-page-title': {
        color: colors.text.primary,
        fontSize: 25,
        letterSpacing: .4,
        fontWeight: "600",
        marginBottom: 20,
        fontFamily: "Poppins"
    },
    'card-container': {
        // backgroundColor: "#00000079",
        height: Platform.OS === "ios" ? 120 : 80,
        width: "100%",
        // marginBottom: 5,
        paddingLeft: 0,
        paddingRight: 10,
        paddingTop: Platform.OS === "ios" ? 30 : 0,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20
    },
    'card-image': {
        height: 54,
        width: 54,
        borderColor: colors.buttons.primary.background,
        borderWidth: 2,
        borderRadius: 50,
        zIndex: 1
    },
    'card-name-text': {
        backgroundColor: colors.buttons.primary.background,
        color: colors.primary,
        fontWeight: "600",
        fontSize: 16,
        letterSpacing: .5,
        display: "flex",
        paddingRight: 10,
        paddingLeft: 34,
        marginLeft: Platform.OS === "ios" ? -25 : -30,
        height: 40,
        lineHeight: 40,
        alignItems: "center",
        overflow: "hidden",
        minWidth: Platform.OS === "ios" ? "20%" : "30%",
        fontFamily: "Poppins",
        borderRadius: Platform.OS === "ios" ? 10 : 10,
        // borderBottomRightRadius: Platform.OS === "ios" ? 20 : 10,
        // borderTopRightRadius: Platform.OS === "ios" ? 20 : 10,
        // borderWidth: 1,
        // borderColor: colors.buttons.primary.background
    }
})