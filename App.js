import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import React from 'react'
import { Text, View } from 'react-native'
import { Provider } from 'react-redux'
import Login from './src/screen/auth'
import Quiz_Page from './src/screen/quiz'
import Quiz_comp from './src/screen/quiz_comp'
import Store from './src/services/redux/store/store'
import SplashScreen from './src/splashScreen'

const App = () => {
  const Stack = createNativeStackNavigator()
  return (
    <Provider store={Store}>
      <NavigationContainer>
        <Stack.Navigator headerMode="none" initialRouteName='splash-screen' screenOptions={{
          headerShown: false,
        }}>
          <Stack.Screen
            name='splash-screen'
            component={SplashScreen}
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
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  )
}

export default App