import * as Font from 'expo-font';

export default useFonts = async () =>
    await Font.loadAsync({
        limelight: require('../../assets/fonts/Jura-VariableFont_wght.ttf')
    });