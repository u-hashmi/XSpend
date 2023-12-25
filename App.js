import { useCallback } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import MainNavigator from './components/navigation/MainNavigator';
import { ThemeProvider} from './components/common/GlobalTheme';
import * as SplashScreen from 'expo-splash-screen';
import {useFonts} from 'expo-font';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const[fontsLoaded] = useFonts({
    "Gabarito-Regular": require("./assets/fonts/Gabarito-Regular.ttf"),
    "Gabarito-Bold": require("./assets/fonts/Gabarito-Bold.ttf"),
    "Gabarito-Medium": require("./assets/fonts/Gabarito-Medium.ttf"),
    "Gabarito-SemiBold": require("./assets/fonts/Gabarito-SemiBold.ttf")
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if(!fontsLoaded) {
    return null;
  }

  return (
    <ThemeProvider >
      <View style={{flex: 1}} onLayout={onLayoutRootView}>
      <MainNavigator style={{fontFamily: 'Gabarito-Regular'}} />
      </View>
    </ThemeProvider> 
  );
}