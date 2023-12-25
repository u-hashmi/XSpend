import React, { useState, useContext, useEffect } from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native'
import { ThemeContext } from '../common/GlobalTheme'
import GlobalStyles from '../common/GlobalStyles'
import { getUserData, saveUserData } from '../../database/Database'

const SummaryRender = ({ monthlyTotal, total }) => {
  const { theme } = useContext(ThemeContext)
  const globalStyles = GlobalStyles(theme)
  const styles = getStyles(theme)
  const [editable, setEditable] = useState(false)
  const [editedPaycheckAmount, setEditedPaycheckAmount] = useState()
  const [paycheckAmount, setPaycheckAmount] = useState(0)
  const handlePaycheckAmountPress = () => {
    setEditable(true)
  }

  useEffect(() => {
    getUserData(
      (userData) => {
        setPaycheckAmount(userData?.paycheckAmount || 0)
      },
      (error) => {
        console.error('Error fetching userData:', error)
      },
    )
  }, [])

  const handlePaycheckAmountChange = (text) => {
    const isValidNumber = !isNaN(parseFloat(text)) && isFinite(text)
    setEditedPaycheckAmount(isValidNumber ? text : '')
    setPaycheckAmount(isValidNumber ? parseFloat(text) : 0)
  }

  const handlePaycheckAmountBlur = () => {
    setEditable(false)
    setEditedPaycheckAmount(paycheckAmount.toFixed(2))
  }

  const handleSave = () => {
    if (editedPaycheckAmount === undefined || editedPaycheckAmount == null) {
      setPaycheckAmount(paycheckAmount)
      setEditedPaycheckAmount(paycheckAmount.toFixed(2))
      setEditable(false)
      return
    } else {
      const newPaycheckAmount = parseFloat(editedPaycheckAmount)
      saveUserData(
        { paycheckAmount: newPaycheckAmount },
        () => {
          setPaycheckAmount(newPaycheckAmount)
          setEditable(false)
        },
        (error) => {
          console.error('Error saving userData:', error)
        },
      )
    }
  }

  return (
    <View style={styles.infoBoxContainer}>
      <TouchableOpacity style={[styles.infoBox]}>
        <Text style={theme.FONTS.caption}>Remaining</Text>
        <Text style={theme.FONTS.heading}>${(paycheckAmount - total).toFixed(2)}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.infoBox,
          theme.SHADOWS.mainShadow,
          { backgroundColor: editable ? theme.COLORS.white : theme.COLORS.primary },
          editable ? styles.bordered : null,
        ]}
        onPress={handlePaycheckAmountPress}
      >
        <Text
          style={[theme.FONTS.caption, editable ? theme.FONTS.primary : theme.FONTS.fontColorWhite]}
        >
          Paycheck
        </Text>
        {editable ? (
          <View style={[globalStyles.flexRow]}>
            <Text
              style={[
                theme.FONTS.heading,
                editable ? theme.FONTS.primary : theme.FONTS.fontColorWhite,
              ]}
            >
              $
            </Text>
            <TextInput
              style={[
                theme.FONTS.heading,
                editable ? theme.FONTS.primary : theme.FONTS.fontColorWhite,
              ]}
              ref={(input) => input && input.focus()}
              keyboardType='numeric'
              value={editedPaycheckAmount}
              returnKeyType='done'
              onChangeText={(value) => handlePaycheckAmountChange(value)}
              onBlur={handlePaycheckAmountBlur}
              onSubmitEditing={handleSave}
            />
          </View>
        ) : (
          <Text style={[theme.FONTS.heading, theme.FONTS.fontColorWhite]}>
            ${paycheckAmount.toFixed(2)}
          </Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={[styles.infoBox]}>
        <Text style={theme.FONTS.caption}>Monthly Total</Text>
        <Text style={theme.FONTS.heading}>${monthlyTotal}</Text>
      </TouchableOpacity>
    </View>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    infoBoxContainer: {
      marginVertical: theme.SIZES.marginXSmall,
      marginBottom: theme.SIZES.marginMedium,
      borderRadius: theme.SIZES.radiusSmall,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    infoBox: {
      width: 130,
      padding: theme.SIZES.paddingMedium,
      borderRadius: theme.SIZES.radiusSmall,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.COLORS.white,
      borderWidth: 1,
      borderColor: theme.COLORS.borderColor,
    },
    editableInput: {
      fontSize: theme.SIZES.body2,
      textAlign: 'center',
    },
    bordered: {
      borderWidth: 2,
      borderColor: theme.COLORS.primary,
    },
  })

export default SummaryRender
