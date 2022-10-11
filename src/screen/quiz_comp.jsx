import React, { useEffect, useState } from 'react'
import { Text, View, ActivityIndicator, Animated, Image, ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import colors from "../../theme/colors"
import { getToken, removeItemValue, replaceString } from '../services/common_functions'
import { getQuestion } from '../services/redux/action/actions'
import { AntDesign } from '@expo/vector-icons'
import { BackHandler } from 'react-native'
import useAuth from '../hooks/useAuth'
import * as Font from 'expo-font'
const Quiz_comp = ({ navigation }) => {

    const LoadFonts = async () => {
        await Font.loadAsync({
            Jura: require('../../assets/fonts/Jura-VariableFont_wght.ttf')
        })
    };

    useEffect(() => {
        LoadFonts()
    }, [])

    const [isSignedIn, isLoginUser, isLogoutUser] = useAuth()
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
    const [currentIndex, setCurrentIndex] = useState(1)
    const [selectedIndex, setSelectedIndex] = useState(null)
    const [isSubmit, setIsSubmit] = useState(true)
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
    const [loginUser, setLoginUser] = useState('')
    const [isBlinking, setIsBlinking] = useState(false)
    const [blinkingInterval, setBlinkingInterval] = useState(false);
    const [correctAnswerCount, setCorrectAnswerCount] = useState(0)

    useEffect(() => {
        dispatch(getQuestion())

        if (!blinkingInterval) {
            setBlinkingInterval(setInterval(() => {
                setIsBlinking(!isBlinking);
            }, 800));
        }

        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            return
        })
    }, [])

    useEffect(() => {
        setTotalCount(selector?.reducer?.question?.results?.length)
        setQuestions(selector?.reducer?.question?.results)
    }, [selector])

    useEffect(() => {
        if (isRestart) {
            dispatch(getQuestion())
            setCurrentIndex(1)
            setOutput({
                ...output,
                count: 0
            })
            setIsRestart(false)
        }
        _start()
        if (isLoading) {
            setTimeout(() => {
            }, 2000)
        }
    }, [isRestart, isLoading])

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
        <View style={{
            backgroundColor: colors.primary,
        }}>
            <StatusBar barStyle="light-content" hidden={false} />
            <View
                style={[
                    styles['card-container']
                ]}>
                <Image
                    source={isSignedIn?.data?.picture?.data?.url ? { uri: isSignedIn?.data?.picture?.data?.url } : require("../../assets/robinCartoon.png")}
                    style={[styles['card-image']]} />
                <Text style={[styles['card-name-text']]}>{isSignedIn?.data?.userName}</Text>
                {/* <Image
                    source={require('../../assets/robinCartoon.png')}
                    style={[
                        styles['card-image']
                    ]} />
                <Text
                    style={[styles['card-name-text']]}>Robin Sharma</Text> */}
            </View>
        </View>
        {!isLoading && currentIndex <= 10 && <View style={[
            styles["top-bar"]
        ]}>
            <Text style={styles['quiz-type']}>Animals Quiz</Text>
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
                            {/* <Text style={{
                                    color: "#fff"
                                }}>
                                    {question.correct_answer}
                                    {correctAnswerCount}
                                </Text> */}
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
                                    {/* {selectedIndex === i && <AntDesign style={{
                                        alignSelf: "center"

                                    }} name="check" size={18} color={output.wrongAnswer ? "red" : "#fff"} />} */}
                                    <AntDesign style={{
                                        alignSelf: "center"

                                    }} name="check" size={18} color={output.wrongAnswer ? "red" : "#fff"} />
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
                                width: "50%",
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
                                removeItemValue('quiz_app.user', navigation.navigate)
                            }}>
                            <View style={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center"
                            }}>
                                <Image source={require('../../assets/logout.png')} style={{
                                    marginRight: 6,
                                    height: 25,
                                    width: 25
                                }} />
                                <Text style={styles['quit-text']}>Quit</Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View
                        style={[
                            {
                                width: "50%",
                                paddingLeft: 5,
                                paddingRight: 5
                            }
                        ]}
                    >
                        <TouchableOpacity
                            style={{
                                ...styles.next,
                                display: currentIndex > 10 ? "none" : "flex",
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
                            <Text style={styles.nextText}>Next</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>}
        </Animated.View>}

        {!isLoading && currentIndex >= 11 && <View style={styles['result-page']}>
            <Text style={[
                styles['result-page-title'],
                {
                    width: "100%",
                    textAlign: "center"
                }
            ]}>Quiz Result</Text>
            <View style={{
                width: "60%",
                height: "30%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <Image source={require('../../assets/gold-cup.png')} style={{
                    height: 150,
                    width: 150,
                }} />

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
                        textAlign: "center"
                    }
                ]}>Congratulation!</Text>
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
                    Thank you, for putting in your precious time for the quiz
                </Text>
                <Text style={[
                    styles['result-page-title'],
                    {
                        fontSize: 18,
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
                        fontSize: 45,
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
        </View>}
        {!isLoading && currentIndex >= 11 && <View style={[styles['footer']]}>
            <View style={styles['buttonContainer']}>
                <View
                    style={[
                        {
                            width: "50%",
                            paddingLeft: 5,
                            paddingRight: 5
                        },
                    ]}>
                    <TouchableOpacity
                        style={{
                            ...styles.quit,
                            display: currentIndex <= 10 ? "none" : "flex",
                        }}
                        disabled={isNext}
                        onPress={() => {
                            BackHandler.exitApp()
                        }}>
                        <View style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            <Image source={require('../../assets/logout.png')} style={{
                                marginRight: 6,
                                height: 25,
                                width: 25
                            }} />
                            <Text style={styles['quit-text']}>Quit</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View
                    style={[
                        {
                            width: "50%",
                            paddingLeft: 5,
                            paddingRight: 5
                        }
                    ]}
                >
                    <TouchableOpacity style={{
                        height: 50,
                        backgroundColor: colors.buttons.primary.background,
                        width: "100%",
                        borderWidth: 1,
                        borderColor: colors.buttons.primary.background,
                        borderRadius: 8,
                        alignItems: "center",
                        justifyContent: "center",
                        ...styles.next
                    }}
                        onPress={() => {
                            setIsRestart(true)
                            setCorrectAnswerCount(0)
                            // setIsLoading(true)
                        }}>
                        <Text style={{
                            // ...styles.nextText,
                            color: colors.text.primary,
                            fontWeight: "700",
                            fontSize: 20,
                            minWidth: 200,
                            textTransform: "uppercase",
                            textAlign: "center",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>Start Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>}
    </View>
}

export default Quiz_comp

const styles = StyleSheet.create({
    'main-container': {
        flex: 1,
        backgroundColor: colors.primary,
        padding: 20,
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
        fontFamily: "Jura"
    },
    'question-number': {
        fontSize: 18
    },
    'quiz-type': {
        color: "#FFD700",
        fontSize: 15,
        // fontWeight: "500",
        marginBottom: 10,
        fontFamily: "Jura"
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
        fontWeight: "500",
        letterSpacing: .5,
        fontFamily: "Jura"
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
        borderRadius: 30,
        height: 60,
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
        fontFamily: "Jura",
        fontWeight: '600',
        letterSpacing: 0.4,
        width: "80%",
        paddingLeft: 10
    },
    'radio-icon-selected': {
        color: colors.buttons.primary.background,
        width: 30,
        height: 30,
        borderWidth: 1,
        borderColor: colors.buttons.primary.background,
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
        fontFamily: "Jura"
    },
    correctAnswer: {
        backgroundColor: colors.text.primary,
        color: colors.text.primary,
        fontFamily: "Jura"
    },
    footer: {
        position: "absolute",
        bottom: 0,
        height: "10%",
        width: "100%",
    },
    'buttonContainer': {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    next: {
        borderRadius: 30,
        height: 50,
        borderWidth: 1,
        borderColor: colors.buttons.primary.background,
        backgroundColor: colors.buttons.primary.background,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    nextText: {
        color: colors.text.primary,
        fontSize: 20,
        letterSpacing: .4,
        fontWeight: "400",
        width: 100,
        textAlign: "center",
        fontFamily: "Jura"
    },
    quit: {
        borderRadius: 30,
        height: 50,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
    },
    'quit-text': {
        color: "#909090",
        fontSize: 20,
        letterSpacing: .4,
        fontWeight: "400",
        // textAlign: "center",
        width: 50,
        fontFamily: "Jura"
    },
    'result-page': {
        flex: 1,
        alignItems: "center",
        padding: 10,
        // marginTop: 30,
    },
    'result-page-title': {
        color: colors.text.primary,
        fontSize: 25,
        letterSpacing: .4,
        fontWeight: "600",
        marginBottom: 20,
        fontFamily: "Jura"
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
        lineHeight: 30,
        display: "flex",
        paddingRight: 10,
        paddingLeft: 40,
        marginLeft: -25,
        height: 40,
        lineHeight: 40,
        alignItems: "center",
        borderRadius: Platform.OS === "ios" ? 20 : 50,
        overflow: "hidden",
        minWidth: Platform.OS === "ios" ? "20%" : "40%",
        fontFamily: "Jura"
    }
})