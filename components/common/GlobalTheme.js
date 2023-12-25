import React, { useState } from 'react';

const ThemeContext = React.createContext();

const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const MainColorPrimary = '#ffffff'
  const MainCounterColor = '#000000'

  const ACCENT_DRAWN = isDarkMode ? MainColorPrimary : MainCounterColor
  const COUNTER_DRAWN = isDarkMode ? MainCounterColor : MainColorPrimary

  const COLORS = {
    primary: ACCENT_DRAWN,
    secondary: ACCENT_DRAWN + '99',
    borderColor: ACCENT_DRAWN + '33',
    fontTheme: ACCENT_DRAWN,
    fontThemeSub: ACCENT_DRAWN + '99',
    white: COUNTER_DRAWN,
    black: '#2c3e50',
    gray: '#95a5a6',
    lightGray: '#ecf0f1',
    darkGray: '#7f8c8d',
    transparent: 'transparent',
    red: '#E94F37'
  }

  const NAVBAR = {
    iconColor: COLORS.primary,
    iconInactiveColor: COLORS.gray,
    iconSize: 24,
  }

  const TEXTSTYLES = {
    textMainColor: '#1D1D1D',
    textSecondaryColor: '#7E7E7E',
    textCaptionColor: '#9DA3B4',
    textWhite: '#FFFFFF',
    textBlack: '#000000',
    textGray: '#9DA3B4',
    textLightGray: '#dbdbdb',
    textDarkGray: '#898C95',
  }

  const SIZES = {
    paddingLarge: 20,
    paddingMedium: 15,
    paddingSmall: 10,
    paddingXSmall: 5,
    marginLarge: 20,
    marginMedium: 15,
    marginSmall: 10,
    marginXSmall: 5,
    radiusLarge: 15,
    radiusMedium: 10,
    radiusSmall: 5,
    radiusXSmall: 3,
    fontLarge: 28,
    fontMedium: 20,
    fontSmall: 16,
    fontXSmall: 12,
  }

  const FONTS = {
    heading: {
      fontFamily: 'Gabarito-Bold',
      fontSize: SIZES.fontLarge,
      color: COLORS.fontTheme,
    },
    subHeading: {
      fontFamily: 'Gabarito-Regular',
      fontSize: SIZES.fontMedium,
      color: COLORS.fontTheme,
    },
    body: {
      fontFamily: 'Gabarito-Regular',
      fontSize: SIZES.fontSmall,
      color: COLORS.fontTheme,
    },
    caption: {
      fontFamily: 'Gabarito-Regular',
      fontSize: SIZES.fontXSmall,
      color: COLORS.fontThemeSub,
    },
    fontColorWhite: {
      color: COLORS.white,
    },
  }

  const STYLES = {
    container: {
      flex: 1,
      backgroundColor: COLORS.white,
    },
    shadow: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
    },
  }

  const OTHERS = {
    border: {
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
    },
  }

  const ICON_COLORS = {
    mainColor: COLORS.primary,
  }

  const SHADOWS = {
    mainShadow: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 3,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 1,
      borderWidth: 1,
      borderColor: COLORS.borderColor,
    },
    otherShadow: {
      shadowColor: COLORS.black,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowOpacity: 0.1,
      shadowRadius: 1,
      elevation: 1,
    },
  }
  const theme = {
    COLORS,
    NAVBAR,
    TEXTSTYLES,
    SIZES,
    FONTS,
    STYLES,
    OTHERS,
    ICON_COLORS,
    SHADOWS,
  };
  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}

export { ThemeProvider, ThemeContext };
