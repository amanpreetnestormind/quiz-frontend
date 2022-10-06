import React, { useEffect, useState } from 'react'
import { Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Animated, BackHandler, Alert, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { getQuestion } from '../services/redux/action/actions'
import { Rating, AirbnbRating } from 'react-native-ratings';
import colors from '../../theme/colors';
import { getToken } from '../services/common_functions';

const Quiz_Page = ({ navigation }) => {
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
    if (isLoading) {
      setTimeout(() => {
        setIsLoading(false)
      }, 4000)
    }
  }, [isRestart, isLoading])

  return (<View style={styles['main-container']}>
    <StatusBar animated={true} barStyle="light-content" />
    {!isLoading && <View style={[styles.header]}>
      <View style={styles['image-container']}>
        <Image source={require('../../assets/images/person3.png')} style={[styles['round-image'], {
          resizeMode: "contain",
        }]} />
        <Text style={[
          styles['user-name']
        ]}>Anglena</Text>
      </View>
    </View>}
    {isLoading && <View style={{
      alignItems: "center",
      justifyContent: "center",
      flex: 1
    }}>
      <ActivityIndicator color="#fff" size="large" />
    </View>}
    {!isLoading && <View style={{
      alignItems: "center",
      marginTop: Platform.OS === "ios" ? "30%" : "10%"
    }}>
      {/* <View>
        <Image source={require('../../assets/images/logo.png')} style={{
          resizeMode: "cover",
          height: 100,
          width: 100
        }} />
      </View> */}
      <View style={styles['center-container']}>
        <View style={styles['circle-container']}>
          <View>
            <Text style={styles['circle-text']}>Quiz</Text>
            <Text style={styles['circle-time-text']}> Time</Text>
          </View>
        </View>
      </View>
      <View style={{
        alignItems: "center",
        height: "100%",
      }}>
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
              width: "90%"
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
                        borderColor: "#fff"
                      } :
                      { ...styles.answerButton },
                    answer.correctAnswer === ans && style == true ? { ...styles.answerButton, ...styles.correctAnswer } : {}
                  ]}
                  onPress={() => {
                    setOutput({
                      ...output,
                      selectedAnswer: ans
                    })
                    setSelectedIndex(i)
                    setIsSubmit(false)
                  }}
                >
                  <Text style={[selectedIndex === i ? { ...styles.answerText, ...styles.selectedText } : { ...styles.answerText },
                  answer.correctAnswer === ans && style == true ? { ...styles.answerText, ...styles.correctAnswer } : {}]}>{ans}</Text>
                </AnimatedClick>))}
              </View>
            </View>
          }
        })}

        {/* ------ Output page ------ */}

        {currentIndex > 10 && <View style={styles.submitPage}>
          <Rating
            type='custom'
            ratingBackgroundColor='#00519B'
            ratingColor='yellow'
            tintColor='#0E346D'
            ratingCount={5}
            imageSize={80}
            startingValue={(output.count / 10)}
            readonly
            style={{
              paddingVertical: 20,
            }}
            fractions="33"
            onFinishRating={(rating) => {
              console.log(rating);
            }}
          />
          <Text style={styles.submitPageText}>Thank you, for putting in your precious time for the quiz. We hope you enjoyed and learned something new.</Text>
          {/* ((Overall Rating * Total Rating) + new Rating) / (Total Rating + 1)
         */}
          {/* <View style={styles.listContainer}>
            {Array.from(Array(10), (e, i) => {
              // <Text key={i} style={styles.listItem}>{i}</Text>
              if (i <= output.count - 1)
                return <Entypo key={i} name="star" size={30} color="#fff" />
              if (!i <= output.count - 1) {
                return <Entypo key={i} name="star-outlined" size={30} color="#fff" />
              }
            })}
          </View> */}
        </View>}
      </View>
    </View>}
    {!isLoading && <View style={[styles.footer]}>
      <View style={styles.buttonContainer}>
        {/* <TouchableOpacity style={{ ...styles.submit, display: currentIndex > 10 ? "none" : "flex" }}
          disabled={isSubmit}
          onPress={() => {
            setIsSubmit(true)
            setAnswerSubmit(true)
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
            setStyle(true)
            setIsNext(false)
          }}>
          <Text style={styles.submitText}>Submit</Text>
        </TouchableOpacity>

        <Text style={{ ...styles.space, display: currentIndex > 10 ? "none" : "flex" }}>|</Text> */}

        <TouchableOpacity style={
          {
            ...styles.next,
            display: currentIndex > 10 ? "none" : "flex",
            width: "90%",
            height: 50
          }}
          // disabled={isNext}
          onPress={() => {
            setIsNext(true)
            setIsSubmit(true)
            setAnswerSubmit(false)
            setStyle(false)
            setSelectedIndex(null)
            setOutput({
              ...output,
              wrongAnswer: false
            })
            if (currentIndex == questions.length) setCurrentIndex(0)
            // setCurrentIndex(currentIndex + 1)
          }}>
          <Text style={styles.nextText}>Next</Text>
        </TouchableOpacity>

        {/* ----- close and restart quiz button ----- */}

        {/* <TouchableOpacity style={{ ...styles.next, display: currentIndex > 10 ? "flex" : "none" }}
          onPress={() => {
            BackHandler.exitApp()
          }}>
          <Text style={styles.nextText}>Close</Text>
        </TouchableOpacity> */}

        {/* <Text style={{ ...styles.space, display: currentIndex > 10 ? "flex" : "none" }}>|</Text> */}

        <TouchableOpacity style={{
          ...styles.submit,
          display: currentIndex > 10 ? "flex" : "none",
          width: "90%",
          height: 50
        }}
          onPress={() => {
            setIsRestart(true)
            setIsLoading(true)
          }}>
          <Text style={{
            ...styles.submitText,
            fontWeight: '700',
            fontSize: 25
          }}>Start Again</Text>
        </TouchableOpacity>
      </View>
    </View>}
  </View >)
}

export default Quiz_Page

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.secondary,
    height: Platform.OS == 'ios' ? 150 : 110,
    borderBottomEndRadius: Platform.OS == "ios" ? 50 : 20,
    borderBottomLeftRadius: Platform.OS == "ios" ? 50 : 20,
  },
  'image-container': {
    height: "100%",
    width: "100%",
    // justifyContent: "center",
    flexDirection: "row",
    alignItems: "center"
  },
  'round-image': {
    height: Platform.OS == 'ios' ? 100 : 70,
    width: Platform.OS == 'ios' ? 100 : 70,
    // backgroundColor: colors.primary,
    marginRight: 10,
    marginLeft: 10,
    borderRadius: 50,
    // borderWidth: 1,
    borderColor: "#fff",
    overflow: "hidden",
  },
  'user-name': {
    color: colors.text.primary,
    fontSize: Platform.OS == "ios" ? 25 : 20,
    marginLeft: 10,
    letterSpacing: .4
  },
  'main-container': {
    flex: 1,
    padding: 0,
    backgroundColor: colors.primary,
    position: "relative"
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  space: {
    color: "#fff",
    marginRight: 10,
    marginLeft: 10,
    height: 44,
    fontSize: 30,
    alignSelf: "center",
  },
  next: {
    borderRadius: 8,
    height: 44,
    borderWidth: 1,
    borderColor: colors.buttons.primary.background,
    backgroundColor: colors.buttons.primary.background,
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "40%"
  },
  nextText: {
    color: colors.primary,
    fontSize: 20,
    letterSpacing: .4,
    fontWeight: "500"
  },
  submit: {
    borderRadius: 8,
    height: 44,
    borderWidth: 1,
    borderColor: "#5EAC24",
    paddingRight: 10,
    paddingLeft: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "40%",
    backgroundColor: "#5EAC24"
  },
  submitText: {
    color: "#fff",
    fontSize: 18
  },
  answerContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 20
  },
  answerButton: {
    width: "50%",
    padding: 10,
    borderWidth: 4,
    backgroundColor: "#fff",
    borderColor: "#0E346D",
    borderRadius: 10,
    height: 80,
    justifyContent: "center",
    alignItems: "center"
  },
  answerText: {
    color: "#0E346D",
    fontSize: 18,
    flexWrap: "wrap",
    fontWeight: '600',
    letterSpacing: 0.4
  },
  selected: {
    backgroundColor: colors.buttons.primary.background
  },
  selectedText: {
    color: "#fff"
  },
  correctAnswer: {
    backgroundColor: "#5EAC24",
    color: "#fff"
  },
  submitPage: {
    padding: 10
  },
  submitPageText: {
    color: "#fff",
    letterSpacing: .4,
    fontWeight: "600",
    fontSize: 30,
    textAlign: "center",
    flexWrap: "wrap",
    lineHeight: 40
  },
  listContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginTop: 10
  },
  listItem: {
    color: "#fff",
  },
  questionContainer: {
    fontSize: 30,
    color: "#fff",
    textAlign: "center"
  },
  textGlowing: {
    textShadowColor: 'rgba(255, 255, 255, 0.75)',
    textShadowOffset: { width: -1, height: 2 },
    textShadowRadius: 15,
    fontSize: 30,
    color: "#fff",
    textAlign: "center"
  },
  "center-container": {
    borderWidth: 1,
    borderColor: "#fff",
    height: 100,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: "10%",
    marginBottom: 10,
    backgroundColor: colors.secondary
  },
  "circle-container": {
    borderWidth: 1,
    borderColor: colors.border.primary,
    width: 90,
    height: 90,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    // shadowColor: 'rgba(255, 255, 255, 0.35)',
    // shadowOffset: {
    //   height: 2,
    //   width: 2
    // },
    shadowOpacity: 1,
    backgroundColor: colors.primary
    // textShadowOffset: { width: 10, height: 3 },
    // textShadowRadius: 15,
  },
  "circle-text": {
    color: colors.text.primary,
    fontSize: Platform.OS === "ios" ? 20 : 20,
    position: "relative",
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: Platform.OS === 'ios' ? { width: -1, height: -1 } : { width: 5, height: 3 },
    // textShadowRadius: 15,
  },
  'circle-time-text': {
    position: "absolute",
    fontSize: 12,
    bottom: -13,
    right: -10,
    color: colors.text.primary,
    textShadowColor: 'rgba(255, 255, 255, 0.35)',
    textShadowOffset: Platform.OS === 'ios' ? { width: 10, height: 3 } : { width: 5, height: 3 },
    // textShadowRadius: 15,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    height: "10%",
    width: "100%",
  }
})