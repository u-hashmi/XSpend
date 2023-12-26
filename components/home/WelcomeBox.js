import React, { useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { ThemeContext } from '../common/GlobalTheme';
import GlobalStyles from '../common/GlobalStyles';
import { StatusBar } from 'expo-status-bar';

const WelcomeBox = ({ username, message = null }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const globalStyles = GlobalStyles(theme);
  const styles = getStyles(theme);
  const [darkModeToggled, setDarkModeToggled] = useState(false);

  if (message === null) {
    message = 'Welcome to your budgeting app!';
  }

  const toggleDarkMode = () => {
    setDarkModeToggled(!darkModeToggled);
    toggleTheme();
  };

  return (
    <View style={[styles.welcomeHeader, globalStyles.flexRow]}>
        <StatusBar style={darkModeToggled ? 'light' : 'dark'} />
      <View>
        <Text style={[theme.FONTS.body, { color: theme.COLORS.fontTheme }]}>Welcome,</Text>
        <Text style={[theme.FONTS.heading, { color: theme.COLORS.fontTheme }]}>{username}</Text>
        <Text style={[theme.FONTS.body, { color: theme.COLORS.fontThemeSub, lineHeight: 20 }]}>{message}</Text>
      </View>
      <View>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.toggleContainer}>
          <Text style={[theme.FONTS.body, { color: theme.COLORS.fontTheme }]}>Dark Mode</Text>
          {darkModeToggled ? (
            <FontAwesome name='toggle-on' size={32} color={theme.COLORS.primary} />
          ) : (
            <FontAwesome name='toggle-off' size={32} color={theme.COLORS.secondary} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const getStyles = (theme) => StyleSheet.create({
  welcomeHeader: {
    padding: theme.SIZES.paddingSmall,
    marginBottom: theme.SIZES.paddingSmall,
    justifyContent: 'space-between',
  },
  toggleContainer: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  }
});

export default WelcomeBox;
