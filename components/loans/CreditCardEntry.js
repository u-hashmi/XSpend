import React, { useState, useContext, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native'

import GlobalStyles from '../common/GlobalStyles'
import { ThemeContext } from '../common/GlobalTheme'
import { saveCardEntry, deleteCardEntry } from '../../database/Database' // Update with the correct database functions
import CommonFunctions from '../common/CommonFunctions'
import { LinearGradient } from 'expo-linear-gradient'

const InputField = ({ label, value, placeholder, keyboardType, onChange, helpText, styles, theme }) => {
    return (
        <View>
            <View style={[styles.inputBar]}>
                <View style={styles.labelContainer}>
                    <Text style={[theme.FONTS.body, styles.titleStyle]}>{label}</Text>
                </View>
                {label === 'Card Title' ? (
                    <TextInput
                        placeholder={placeholder}
                        returnKeyType='done'
                        placeholderTextColor={theme.COLORS.fontThemeSub}
                        value={value}
                        keyboardType={keyboardType}
                        onChange={onChange}
                        style={[theme.FONTS.subHeading, styles.textInput]}
                    />
                ) : (
                    <TextInput
                        placeholder={placeholder}
                        returnKeyType='done'
                        placeholderTextColor={theme.COLORS.fontThemeSub}
                        value={value}
                        keyboardType={keyboardType}
                        onTextInput={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                        }}
                        onChange={onChange}
                        style={[theme.FONTS.subHeading, styles.textInput]}
                    />
                )}
            </View>
            <View>{helpText !== '' && <Text style={styles.helpTextStyle}>{helpText}</Text>}</View>
        </View>
    )
}

const CreditCardEntry = ({ navigation, route }) => {
    const { dataItem } = route.params
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)
    const styles = getStyles(theme)
    const [entryId, setEntryId] = useState(dataItem?.id || null)
    const [cardData, setCardData] = useState({
        id: entryId,
        cardTitle: (dataItem && dataItem.cardTitle) || '',
        cardBalance: (dataItem && dataItem.cardBalance.toString()) || '0.00',
        limit: (dataItem && dataItem.limit.toString()) || '0.00',
        monthlyPayment: (dataItem && dataItem.monthlyPayment.toString()) || '0.00',
        APR: (dataItem && dataItem.APR.toString()) || '0.00',
    })

    const [helpText, setHelpText] = useState({
        cardTitle: '',
        cardBalance: '',
        limit: '',
        monthlyPayment: '',
        APR: '',
    })

    useEffect(() => {
        setHelpText({
            cardTitle: '',
            cardBalance: '',
            limit: '',
            monthlyPayment: '',
            APR: '',
        })
    }, [])

    useEffect(() => {
        if (dataItem) {
            setCardData({
                id: entryId,
                cardTitle: dataItem.cardTitle || '',
                cardBalance: dataItem.cardBalance || '0.00',
                limit: dataItem.limit || '0.00',
                monthlyPayment: dataItem.monthlyPayment || '0.00',
                APR: dataItem.APR || '0.00',
            })
        }
    }, [dataItem])

    const handleTextChange = (key, e) => {
        const { text } = e.nativeEvent
        setHelpText({ ...helpText, [key]: '' })
        setCardData({ ...cardData, [key]: text })
    }

    const handleAmountSet = (key, e) => {
        e.preventDefault()
        e.stopPropagation()

        const { text } = e.nativeEvent
        const isDeletion = text.length < cardData[key].length
        if (!isDeletion && (text.endsWith('-') || text.endsWith('.') || text.endsWith(',') || text.endsWith(' '))) return
        if ((!isDeletion || text !== '0.00') && CommonFunctions.isNumber(text)) {
            setCardData({
                ...cardData,
                [key]: CommonFunctions.sanitizeFiat(e.nativeEvent.text, isDeletion),
            })
            setHelpText({ ...helpText, [key]: '' })
        }
    }

    const saveEntryToDatabase = () => {
        if (entryId !== null) {
            setCardData({ ...cardData, id: entryId })
        }

        const validateField = (field, fieldName) => {
            if (!cardData[field] || parseFloat(cardData[field]) === 0) {
                setHelpText({ ...helpText, [field]: `**enter a valid ${fieldName.toLowerCase()}` })
                return false
            }
            return true
        }

        if (
            !validateField('cardTitle', 'Title') ||
            !validateField('cardBalance', 'Balance') ||
            !validateField('limit', 'Limit') ||
            !validateField('monthlyPayment', 'Monthly Payment') ||
            !validateField('APR', 'APR')
        ) {
            return
        }

        saveCardEntry(
            cardData,
            (insertId) => {
                console.log('Entry saved with ID:', insertId)
            },
            (error) => {
                console.error('Error saving entry:', error)
            },
        )

        navigation.goBack()
    }

    const deleteEntryFromDatabase = () => {
        deleteCardEntry(
            entryId,
            () => {
                console.log('Entry deleted successfully')
            },
            (error) => {
                console.warn(error)
            },
        )
        navigation.goBack()
    }

    const cancelEntry = () => {
        navigation.goBack()
    }

    const resetEntry = () => {
        setCardData({
            cardTitle: '',
            cardBalance: '0.00',
            limit: '0.00',
            monthlyPayment: '0.00',
            APR: '0.00',
        })
        setHelpText({
            cardTitle: '',
            cardBalance: '',
            limit: '',
            monthlyPayment: '',
            APR: '',
        })
    }

    return (
        <View style={[globalStyles.safeArea, globalStyles.container, styles.baseContainer]}>
            <LinearGradient colors={[theme.COLORS.secondary, theme.COLORS.primary]} style={{flex: 1, justifyContent: 'center'}} >
                <KeyboardAvoidingView behavior='padding'>
                    <ScrollView scrollEnabled={false} style={styles.mainContainer} >
                        <View style={styles.messageContainer}>
                            <Text style={[theme.FONTS.heading]}>Card Entry</Text>
                            <Text style={[theme.FONTS.body]}>Manage your credit cards!</Text>
                        </View>
                        <View style={styles.entryPanel}>
                            <InputField
                                label='Card Title'
                                value={cardData.cardTitle}
                                placeholder='Card Title'
                                keyboardType='default'
                                onChange={(text) => handleTextChange('cardTitle', text)}
                                helpText={helpText.cardTitle}
                                styles={styles}
                                theme={theme}
                            />

                            <InputField
                                label='Balance $'
                                value={cardData.cardBalance.toString()}
                                placeholder='0.00'
                                keyboardType='decimal-pad'
                                onChange={(e) => handleAmountSet('cardBalance', e)}
                                helpText={helpText.cardBalance}
                                styles={styles}
                                theme={theme}
                            />

                            <InputField
                                label='Limit $'
                                value={cardData.limit.toString()}
                                placeholder='0.00'
                                keyboardType='decimal-pad'
                                onChange={(e) => handleAmountSet('limit', e)}
                                helpText={helpText.limit}
                                styles={styles}
                                theme={theme}
                            />

                            <InputField
                                label='Monthly Payment $'
                                value={cardData.monthlyPayment.toString()}
                                placeholder='0.00'
                                keyboardType='decimal-pad'
                                onChange={(e) => handleAmountSet('monthlyPayment', e)}
                                helpText={helpText.monthlyPayment}
                                styles={styles}
                                theme={theme}
                            />

                            <InputField
                                label='APR (%)'
                                value={cardData.APR.toString()}
                                placeholder='0.00'
                                keyboardType='decimal-pad'
                                onChange={(e) => handleAmountSet('APR', e)}
                                helpText={helpText.APR}
                                styles={styles}
                                theme={theme}
                            />

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={[styles.button, theme.SHADOWS.mainShadow, { marginLeft: 0 }]} onPress={resetEntry}>
                                    <Text style={[theme.FONTS.body, theme.FONTS.fontColorWhite]}>Reset</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.button, theme.SHADOWS.mainShadow, styles.deleteButton]}
                                    onPress={deleteEntryFromDatabase}
                                >
                                    <Text style={[theme.FONTS.subHeading, theme.FONTS.fontColorWhite]}>Delete</Text>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.button, theme.SHADOWS.mainShadow]} onPress={cancelEntry}>
                                    <Text style={[theme.FONTS.subHeading, theme.FONTS.fontColorWhite]}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.button, theme.SHADOWS.mainShadow, { marginRight: 0 }]} onPress={saveEntryToDatabase}>
                                    <Text style={[theme.FONTS.subHeading, theme.FONTS.fontColorWhite]}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </LinearGradient>
        </View>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        baseContainer: {
            flex: 1,
            justifyContent: 'center',
            padding:0
        },
        mainContainer: {
            backgroundColor: theme.COLORS.white,
            borderWidth: 1,
            borderColor: theme.COLORS.borderColor,
            paddingTop: theme.SIZES.paddingSmall,
            margin: theme.SIZES.marginSmall,
            borderRadius: theme.SIZES.radiusSmall,
        },
        entryPanel: {
            flex: 1,
            padding: theme.SIZES.paddingSmall,
            borderRadius: theme.SIZES.radiusSmall,
        },
        inputBar: {
            marginVertical: theme.SIZES.marginXSmall,
            alignItems: 'center',
            flexDirection: 'row',
        },
        labelContainer: {
            width: 160,
            justifyContent: 'right',
            backgroundColor: theme.COLORS.primary,
            padding: theme.SIZES.paddingMedium + 2,
            borderTopLeftRadius: theme.SIZES.radiusXSmall,
            borderBottomLeftRadius: theme.SIZES.radiusXSmall,
            borderWidth: theme.SIZES.borderWidth,
        },
        titleStyle: {
            alignSelf: 'flex-start',
            color: theme.COLORS.white,
        },
        textInput: {
            padding: theme.SIZES.paddingMedium,
            fontFamily: 'Gabarito-Regular',
            borderWidth: theme.SIZES.borderWidth,
            paddingLeft: theme.SIZES.paddingSmall,
            borderColor: theme.COLORS.borderColor,
            borderTopRightRadius: theme.SIZES.radiusXSmall,
            borderBottomRightRadius: theme.SIZES.radiusXSmall,
            flex: 1,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: theme.SIZES.marginXSmall,
        },
        button: {
            flex: 1,
            height: 45,
            marginHorizontal: theme.SIZES.marginXSmall / 2,
            padding: theme.SIZES.paddingSmall,
            borderRadius: theme.SIZES.radiusXSmall,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.COLORS.primary,
        },
        deleteButton: {
            backgroundColor: theme.COLORS.red,
        },
        helpTextStyle: {
            ...theme.FONTS.caption,
            color: theme.COLORS.red,
            overflow: 'hidden',
        },
        messageContainer: {
            marginHorizontal: theme.SIZES.marginSmall,
            borderRadius: theme.SIZES.radiusSmall,
            justifyContent: 'center',
            padding: theme.SIZES.paddingXSmall,
            backgroundColor: theme.COLORS.white,
        },
    })

export default CreditCardEntry
