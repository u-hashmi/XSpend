import React, { useContext } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import globalStyles from '../common/GlobalStyles'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import { ThemeContext } from '../common/GlobalTheme'

const SubtotalRender = ({ paidTotal, unpaidTotal }) => {
  const { theme } = useContext(ThemeContext)
  const styles = getStyles(theme)
  return (
    <View style={styles.infoBoxContainer}>
      <View style={[styles.infoBox]}>
        <Text style={theme.FONTS.caption}>Paid</Text>
        <Text style={theme.FONTS.heading}>${paidTotal}</Text>
      </View>
      <View style={[styles.infoBox]}>
        <Text style={theme.FONTS.caption}>Unpaid</Text>
        <Text style={theme.FONTS.heading}>${unpaidTotal}</Text>
      </View>
    </View>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    infoBoxContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoBox: {
      flex: 1,
      padding: theme.SIZES.paddingMedium,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default SubtotalRender
