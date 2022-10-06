import React, { useEffect, useState } from 'react'
import { Alert, Image, ImageBackground, Platform, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Entypo, AntDesign, FontAwesome } from '@expo/vector-icons'
import * as Facebook from 'expo-facebook';
import axios from 'axios';
import { REACT_APP_FACEBOOK_ID } from '@env'
import { useDispatch } from 'react-redux';
import { userRegisterAndLogin } from '../../services/redux/action/actions';
import colors from '../../../theme/colors';
import { SvgUri, SvgXml } from 'react-native-svg';
import SVGFacebook from '../../../assets/facebook.svg'

// import { initializeApp } from 'firebase/app';
// import {
//   getAuth,
//   onAuthStateChanged,
//   FacebookAuthProvider,
//   signInWithCredential,
// } from 'firebase/auth';

// import {
//     GoogleSignin,
//     GoogleSigninButton,
//     statusCodes,
// } from '@react-native-google-signin/google-signin';

// GoogleSignin.configure({
//     scopes: ['https://www.googleapis.com/auth/drive.readonly'], // what API you want to access on behalf of the user, default is email and profile
//     webClientId: '601098414122-ormv9lf2vdsg24l29kt83ukvth322s85.apps.googleusercontent.com', // client ID of type WEB for your server (needed to verify user ID and offline access)
//     offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
//     hostedDomain: '', // specifies a hosted domain restriction
//     forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs link below *.
//     accountName: '', // [Android] specifies an account name on the device that should be used
//     iosClientId: '601098414122-a2n41m4ns7minb866hp5e2b5r9pfb503.apps.googleusercontent.com', // [iOS] if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
//     googleServicePlistPath: '', // [iOS] if you renamed your GoogleService-Info file, new name here, e.g. GoogleService-Info-Staging
//     openIdRealm: '', // [iOS] The OpenID2 realm of the home web server. This allows Google to include the user's OpenID Identifier in the OpenID Connect ID token.
//     profileImageSize: 120, // [iOS] The desired height (and width) of the profile image. Defaults to 120px
// });
const Login = ({ navigation }) => {
  const [state, setState] = useState()
  const [userData, setUserData] = useState({
    "userEmail": "amanpr1023@gmial.com",
    "facebookId": "12346",
    "googleId": "456789000000",
    "userName": "Preet Singh"
  })
  const dispatch = useDispatch()
  // const signIn = async () => {
  //     try {
  //         await GoogleSignin.hasPlayServices({ autoResolve: true, showPlayServicesUpdateDialog: true });
  //         const userInfo = await GoogleSignin.signIn();
  //         setState({ userInfo });
  //     } catch (error) {
  //         console.log(error,"Error comes");
  //         if (error.code === statusCodes.SIGN_IN_CANCELLED) {
  //             // user cancelled the login flow
  //         } else if (error.code === statusCodes.IN_PROGRESS) {
  //             // operation (e.g. sign in) is in progress already
  //         } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
  //             // play services not available or outdated
  //         } else {
  //             // some other error happened
  //         }
  //     }
  // };

  return (<View style={styles['main-container']}>
    {/* <GoogleSigninButton
                style={{ width: 192, height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={signIn}
                disabled={state.isSigninInProgress}
            />; */}

    {/* <View style={styles['center-container']}>
      <View style={styles['circle-container']}>
        <View>
          <Text style={styles['circle-text']}>Quiz</Text>
          <Text style={styles['circle-time-text']}> Time</Text>
        </View>
      </View>
    </View> */}

    <Image source={require('../../../assets/images/logo.png')} style={{
      resizeMode: "cover"
    }} />
    <View style={styles.footer}>
      <View style={styles['button-main-container']}>
        <TouchableOpacity style={styles['button-container']}
          onPress={async () => {
            try {
              await Facebook.initializeAsync({
                appId: REACT_APP_FACEBOOK_ID
              });
              const { type, token, expirationDate, permissions, declinedPermissions } = await Facebook.logInWithReadPermissionsAsync({ permissions: ['public_profile'] });
              if (type === 'success') {
                // Get the user's name using Facebook's Graph API
                axios.get(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,about,picture`).then(response => {
                  setUserData({
                    ...userData,
                    facebookId: response.data.id,
                    userEmail: response.data.email,
                    userName: response.data.name
                  })
                  // console.log(response);
                  dispatch(userRegisterAndLogin({
                    facebookId: response.data.id,
                    userEmail: response.data.email,
                    userName: response.data.name,
                    googleId: ""
                  }, navigation.navigate))

                }).catch(err => {
                  console.log(err, REACT_APP_FACEBOOK_ID, "REACT_APP_FACEBOOK_ID");
                });
              } else {
                // type === 'cancel'
                console.log(REACT_APP_FACEBOOK_ID, "REACT_APP_FACEBOOK_ID");
              }
            } catch ({ message }) {
              alert(`Facebook Login Error: ${message}`);
            }
          }}>
          <Entypo name="facebook" style={styles['icon-style']} />
          {/* <Image source={require('../../../assets/facebook.svg')} style={{
            backgroundColor: "#fff"
          }} /> */}
        </TouchableOpacity>
        {/* <Text style={styles['button-text']}>
            Login with Facebook</Text> */}

        <TouchableOpacity style={styles['button-container']}>
          <FontAwesome name="google-plus-square" style={styles['icon-style']} />
        </TouchableOpacity>
        {/* <Text style={styles['button-text']}>
            Login with Google</Text> */}
      </View>
    </View>
  </View >)
}

export default Login
// primary "#0E346D"
const styles = StyleSheet.create({
  'main-container': {
    flex: 1,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary
  },
  "button-main-container": {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    display: "flex",
    flexDirection: "row",
    // marginTop: Platform.OS == "ios" ? 20 : 0,
    // flex: 1,
  },
  "button-container": {
    // paddingRight: 20,
    // paddingLeft: 20,
    // paddingTop: 5,
    // paddingBottom: 5,
    // borderRadius: 50,
    // backgroundColor: "#fff",
    // borderRadius: 50,
    // flexDirection: "row",
    // justifyContent: "space-evenly",
    // alignItems: "center",
    // width: "80%",
    // position: "relative",
    // borderWidth: 1,
    // marginBottom: 20
    margin: 6

  },
  "button-text": {
    color: "#0E346D",
    fontSize: 17,
    fontWeight: "700",
    width: 200
  },
  "icon-style": {
    fontSize: 60,
    color: colors.icon.primary
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
    height: 160,
    position: "absolute",
    bottom: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  'logo-image': {
    height: 20,
    width: 100
  },
  'footer-inner': {
    color: colors.text.primary,
    fontSize: 20,
    letterSpacing: .5
  }
})