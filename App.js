import React, { useState, useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, Text, View } from 'react-native'
import { Provider } from 'react-redux'
import Login from './src/screen/auth'
import Confirmation from './src/screen/auth/confirmation'
import Quiz_comp from './src/screen/quiz_comp'
import Store from './src/services/redux/store/store'
import SplashScreen1 from './src/splashScreen'
import * as Font from 'expo-font'
import useAuth from './src/hooks/useAuth'
import { Platform } from 'react-native'

const App = () => {
  const [isSignedIn, isLoginUser, logoutUser] = useAuth()
  const Stack = createNativeStackNavigator()
  
  const LoadFonts = async () => {
    await Font.loadAsync({
      "Poppins": require("./assets/fonts/Poppins-Medium.ttf")
    })
  };

  useEffect(() => {
    LoadFonts()
  }, [])

  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator
          headerMode="none"
          initialRouteName='splash-screen'
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen
            name='splash-screen'
            component={SplashScreen1}
            options={{
              headerTransparent: false,
              headerTitle: () => null,
              headerShown: false,
              header: () => null
            }} />
          <Stack.Screen
            name='login'
            component={Login}
            options={{
              headerTransparent: false,
              headerTitle: () => null,
              headerShown: false,
              header: () => null,
            }}
          />
          <Stack.Screen
            name='quiz_comp'
            component={Quiz_comp}
            options={{
              headerTitle: () => <View style={{
                display: "flex",
                justifyContent: "center",
              }}
              >
                <Text>Quiz</Text>
              </View>,
              headerShown: () => null,
              headerTransparent: true,
              headerTitle: () => null,
              headerShown: false,
              // header: () => null,
            }}
          />

          <Stack.Screen
            name='confirmation'
            component={Confirmation}
            options={{
              headerTitle: () => <View style={{
                display: "flex",
                justifyContent: "center",
              }}
              >
                <Text>Quiz</Text>
              </View>,
              headerShown: () => null,
              headerTransparent: true,
              headerTitle: () => null,
              headerShown: false,
              // header: () => null,
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App