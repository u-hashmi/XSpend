import React, { useState, useContext } from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
} from 'react-native'
import GlobalStyles from '../common/GlobalStyles'
import { ThemeContext } from '../common/GlobalTheme'
import { IconLibrary, Icons } from '../common/GlobalIcons'

export function sanitizeFiat(newValue, isDeletion) {
  const newStr = newValue.toString()
  return parseFloat(isDeletion ? newStr / 10 : newStr * 10)
    .toFixed(2)
    .toString()
}

const isNumber = (text) => {
  return !Number.isNaN(text.replace('.', '').replace('-', ''))
}

const AboutScreen = () => {
  const { theme } = useContext(ThemeContext)
  const globalStyles = GlobalStyles(theme)
  const styles = getStyles(theme)

  const [dataObject, setDataObject] = useState({
    title: '',
    amount: 0,
    category: '',
    dueDate: 1,
    isPaid: false,
  })

  const [isPaid, setIsPaid] = useState(false)
  const [amount, setAmount] = useState('0.00') // Default value should be a string
  const [category, setCategory] = useState('')
  const [dueDate, setDueDate] = useState(1)
  const [title, setTitle] = useState('')
  const options = ['Credit', 'Loan', 'Misc', 'Utility']

  const handleCategorySelect = (value) => {
    setCategory(value)
    setDataObject({ ...dataObject, category: value })
  }

  const handleTitleSet = (value) => {
    setTitle(value)
    setDataObject({ ...dataObject, title: value })
  }

  const handleAmountSet = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const { text } = e.nativeEvent
    const isDeletion = text.length < amount.length
    if (
      !isDeletion &&
      (text.endsWith('-') || text.endsWith('.') || text.endsWith(',') || text.endsWith(' '))
    )
      return
    if ((!isDeletion || text !== '0.00') && isNumber(text))
      setAmount(sanitizeFiat(e.nativeEvent.text, isDeletion))
  }

  const handleDueDaySelect = ({ item }) => {
    setDueDate(parseInt(item))
    setDataObject({ ...dataObject, dueDate: parseInt(item) })
  }

  const handleIsPaid = () => {
    setIsPaid(!isPaid)
    setDataObject({ ...dataObject, isPaid: !isPaid })
    console.log(dataObject)
  }

  const generateCategorySelector = () => {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.comboContainer}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option.toString()}
              onPress={() => handleCategorySelect(option)}
              style={[
                styles.comboItemStyle,
                {
                  marginLeft: index === 0 ? 0 : theme.SIZES.marginXSmall / 2,
                  marginRight: index === options.length - 1 ? 0 : theme.SIZES.marginXSmall / 2,
                  backgroundColor: option === category ? theme.COLORS.primary : theme.COLORS.white,
                },
              ]}
            >
              <Text
                style={[
                  theme.FONTS.subHeading,
                  { color: option === category ? theme.COLORS.white : theme.COLORS.primary },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    )
  }

  const getDueDateSuffix = (day) => {
    if (day >= 11 && day <= 13) {
      return 'th'
    }
    const lastDigit = day % 10
    switch (lastDigit) {
      case 1:
        return 'ˢᵗ'
      case 2:
        return 'ⁿᵈ'
      case 3:
        return 'ʳᵈ'
      default:
        return 'ᵗʰ'
    }
  }

  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <Text>About Screen</Text>
      </View>
    </SafeAreaView>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    
    container: {
      marginVertical: 10,
    },
    
  })

export default AboutScreen
