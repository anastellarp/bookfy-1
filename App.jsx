import React, { useState } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { Provider as PaperProvider } from 'react-native-paper';
import Routes from './src/routes';
import { StatusBar } from 'expo-status-bar';
import { appThemeLight, appThemeDark } from './src/themes/appTheme';

export default function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => setIsDarkTheme(!isDarkTheme);

  const combinedTheme = isDarkTheme ? appThemeDark : appThemeLight;

  return (
    <PaperProvider theme={combinedTheme}>
      <NavigationContainer theme={combinedTheme}>
        <Routes toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
        <StatusBar style={isDarkTheme ? 'light' : 'dark'} />
      </NavigationContainer>
    </PaperProvider>
  );
}
