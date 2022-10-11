import * as Font from 'expo-font';

const useFonts = async () =>
    await Font.loadAsync({
        Jura: require('../../assets/fonts/Jura-VariableFont_wght.ttf')
    });

export default useFonts