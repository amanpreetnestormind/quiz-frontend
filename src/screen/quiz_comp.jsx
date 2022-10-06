import React, { useEffect, useState } from 'react'
import { Text, View, ActivityIndicator, Animated, Image, ImageBackground, Platform, StatusBar, StyleSheet, TouchableOpacity, TouchableWithoutFeedback } from "react-native"
import { useDispatch, useSelector } from "react-redux"
import colors from "../../theme/colors"
import { getToken } from '../services/common_functions'
import { getQuestion } from '../services/redux/action/actions'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import { SvgUri } from 'react-native-svg'
import FacebookImage from '../../assets/facebook.svg'

const Quiz_comp = ({ navigation }) => {
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

    const getUser = async () => {
        const user = await getToken("quiz_app.user")
        setLoginUser(user)
        return user
    }

    useEffect(() => {
        getUser()
        dispatch(getQuestion())
        setIsLoading(true)
        // setAnimationState({
        //     ...animationState,
        //     slideUpValue: new Animated.Value(0)
        // })

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
        getUser()
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
                setIsLoading(false)
            }, 4000)
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
        <StatusBar barStyle="light-content" hidden={false} />
        {isLoading && <View style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1
        }}>
            <ActivityIndicator color="#fff" size="large" />
        </View>}
        {!isLoading && currentIndex <= 10 && <View style={[
            styles["top-bar"]
        ]}>
            <Text style={styles['quiz-type']}>IQ-Test</Text>
            <Text style={[
                styles['question-title']
            ]}>Question
                <Text style={[
                    styles['question-number']
                ]}> {currentIndex}/10</Text>
            </Text>
            {/* <View style={{
                display: "flex",
                flexDirection: "row",
                width:"100%",
                justifyContent:"space-between"
            }}>
                {Array.from(Array(10), (e, i) => (<Text style={{
                    color: "#fff",
                }}>-</Text>))}
            </View> */}
            {/* <View style={{
                borderWidth: 1,
                marginTop: 10,
                borderColor: "#fff",
                borderStyle: "dotted"
            }}></View> */}
        </View>}

        {/* {!isLoading && <View style={{
            position: "absolute",
            right: Platform.OS === "ios" ? 10 : 5,
            top: Platform.OS === "ios" ? 0 : 5
        }}>
            <MaterialCommunityIcons name="logout" size={24} color="#fff" onPress={() => {

            }} />
        </View>} */}

        {!isLoading && currentIndex <= 10 && <Animated.View style={[
            styles['question-container'],
            {
                transform: [
                    {
                        translateX: animationState.slideUpValue.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-600, 0]
                        })
                    }
                ]
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
                        ]}>{question?.question}</Text>
                        <View style={styles.answerContainer}>
                            {question.incorrect_answers?.map((ans, i) => (<AnimatedClick
                                disabled={answerSubmit}
                                key={i}
                                style={[
                                    selectedIndex === i ?
                                        {
                                            ...styles.answerButton,
                                            backgroundColor: output.wrongAnswer ? "red" : colors.primary,
                                            borderColor: output.wrongAnswer ? "red" : colors.buttons.primary.background
                                        } :
                                        { ...styles.answerButton },
                                    answer.correctAnswer === ans && style == true ? {
                                        ...styles.answerButton, ...styles.correctAnswer
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
                                            ...styles.selectedText
                                        } : { ...styles.answerText },
                                    answer.correctAnswer === ans && style == true ?
                                        { ...styles.answerText, ...styles.correctAnswer } :
                                        { color: colors.text.primary },
                                ]}>{ans}</Text>
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
                            setTimeout(() => {
                                setIsNext(true)
                                setStyle(false)
                                setSelectedIndex(null)
                                setAnswerSubmit(false)
                                setIsLoading(true)
                                // setAnimationState({
                                //     ...animationState,
                                //     slideUpValue: new Animated.Value(0)
                                // })
                                setOutput({
                                    ...output,
                                    wrongAnswer: false
                                })
                                setCurrentIndex(currentIndex + 1)
                            }, 3000)
                        }}>
                        <Text style={styles.nextText}>Next</Text>
                    </TouchableOpacity>
                </View>
            </View>}
        </Animated.View>
        }
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
            }}>
                <ImageBackground source={require('../../assets/images/trophy.webp')}
                    style={{
                        height: "100%", width: "100%",
                        alignItems: "center"
                    }}
                >
                    <Image source={require('../../assets/images/person3.png')} style={{
                        borderRadius: 50,
                        height: 80,
                        width: 80,
                        top: Platform.OS === "ios" ? 19 : 2.2
                    }} />
                </ImageBackground>

            </View>
            <View style={{
                alignItems: "center",
                marginTop: 20,
            }}>
                <Text style={[
                    styles['result-page-title'],
                    {
                        fontSize: 30,
                        fontWeight: "bold",
                        marginTop: 10,
                        width: 250,
                        textAlign: "center"
                    }
                ]}>Congratulation!</Text>
                <Text style={[
                    styles['result-page-title'],
                    {
                        fontSize: 16,
                        marginTop: 10,
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
                        marginTop: 15,
                        textAlign: "center",
                        letterSpacing: .5,
                        lineHeight: 25,
                        textTransform: "uppercase",
                        color: colors.text.secondary,
                        width: 250
                    }
                ]}>
                    your score
                </Text>

                <Text style={[
                    styles['result-page-title'],
                    {
                        fontSize: 45,
                        marginTop: 15,
                        textAlign: "center",
                        letterSpacing: .5,
                        textTransform: "uppercase",
                        width: 250
                    }
                ]}>
                    <Text style={{
                        color: "#00DAFF",
                    }}>{output.count}</Text>/10
                </Text>
            </View>
        </View>}
        {!isLoading && currentIndex >= 11 && <View style={{
            height: "10%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center"
        }}>
            <TouchableOpacity style={{
                height: 50,
                backgroundColor: colors.buttons.primary.background,
                width: "100%",
                borderWidth: 1,
                borderColor: colors.buttons.primary.background,
                borderRadius: 8,
                alignItems: "center",
                justifyContent: "center"
            }}
                onPress={() => {
                    setIsRestart(true)
                    setIsLoading(true)
                }}>
                <Text style={{
                    color: colors.text.primary,
                    fontWeight: "700",
                    fontSize: 25,
                    textTransform: "uppercase"
                }}>Start Again</Text>
            </TouchableOpacity>
        </View>}
    </View >
}

export default Quiz_comp

const styles = StyleSheet.create({
    'main-container': {
        flex: 1,
        backgroundColor: colors.primary,
        paddingTop: Platform.OS == "ios" ? 40 : 0,
        padding: 20,
        position: "relative"
    },
    'top-bar': {},
    'question-title': {
        color: "#06D3F6",
        fontSize: 20,
        fontWeight: "700",
        letterSpacing: .4
    },
    'question-number': {
        fontSize: 20
    },
    'quiz-type': {
        color: colors.text.secondary,
        fontSize: 20,
        fontWeight: "500",
        marginBottom: 10
    },
    'question-container': {
        flex: 1,
        marginTop: 20,
        alignItems: "flex-start",
        height: "100%",
    },
    textGlowing: {
        // textShadowColor: 'rgba(255, 255, 255, 0.75)',
        // textShadowOffset: { width: -1, height: 1 },
        // textShadowRadius: 2,
        fontSize: 25,
        color: colors.text.primary,
        width: "100%",
        lineHeight: 30,
        minHeight: 100,
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
        borderWidth: 2,
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
        // marginBottom: 8
    },
    answerText: {
        color: colors.text.primary,
        fontSize: 16,
        // flexWrap: "wrap",
        fontWeight: '600',
        letterSpacing: 0.4,
        width: "80%",
        paddingLeft: 10
    },
    'radio-icon-selected': {
        color: colors.buttons.primary.background,
        width: 30,
        height: 30,
        borderWidth: 2,
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
        borderWidth: 2,
        borderColor: "#fff",
        borderRadius: 15,
        overflow: "hidden"
    },
    selected: {
        backgroundColor: colors.buttons.primary.background
    },
    selectedText: {
        color: "#00DAFF",
        fontSize: 17,
        fontWeight: "800"
    },
    correctAnswer: {
        backgroundColor: colors.text.primary,
        color: colors.text.primary
    },
    footer: {
        position: "absolute",
        bottom: 0,
        height: "10%",
        width: "100%",
    },

    next: {
        borderRadius: 30,
        height: 60,
        borderWidth: 1,
        borderColor: colors.buttons.primary.background,
        backgroundColor: colors.buttons.primary.background,
        paddingRight: 10,
        paddingLeft: 10,
        alignItems: "center",
        justifyContent: "center",
        width: "100%"
    },
    nextText: {
        color: colors.text.primary,
        fontSize: 20,
        letterSpacing: .4,
        fontWeight: "700",
        width: 100,
        textAlign: "center"
    },
    'result-page': {
        flex: 1,
        alignItems: "center",
        padding: 10,
        marginTop: 30,
    },
    'result-page-title': {
        color: colors.text.primary,
        fontSize: 25,
        letterSpacing: .4,
        fontWeight: "600",
        marginBottom: 20,
    }
})