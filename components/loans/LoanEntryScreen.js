import React, { useState, useContext, useEffect } from 'react'
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, ImageBackground, KeyboardAvoidingView, ScrollView } from 'react-native'

import GlobalStyles from '../common/GlobalStyles'
import { ThemeContext } from '../common/GlobalTheme'
import { saveLoanEntry, deleteLoanEntry } from '../../database/Database'
import CommonFunctions from '../common/CommonFunctions'

const InputField = ({ label, value, placeholder, keyboardType, onChange, helpText, styles, theme }) => {
    return (
        <View >
            <View style={[styles.inputBar]}>
                <View style={styles.labelContainer}>
                    <Text style={[theme.FONTS.body, styles.titleStyle]}>{label}</Text>
                </View>
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
            </View>
            <View>{helpText !== '' && <Text style={styles.helpTextStyle}>{helpText}</Text>}</View>
        </View>
    )
}

const LoanEntryScreen = ({ navigation, route }) => {
    const { dataItem } = route.params
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)
    const styles = getStyles(theme)
    const [entryId, setEntryId] = useState(dataItem?.id || null)
    const [loanData, setLoanData] = useState({
        id: entryId,
        loanTitle: (dataItem && dataItem.loanTitle) || '',
        monthlyPayment: (dataItem && dataItem.monthlyPayment.toString()) || '0.00',
        loanAmount: (dataItem && dataItem.loanAmount.toString()) || '0.00',
        remainingAmount: (dataItem && dataItem.remainingAmount.toString()) || '0.00',
        APR: (dataItem && dataItem.APR.toString()) || '0.00',
    })

    const [helpText, setHelpText] = useState({
        loanTitle: '',
        monthlyPayment: '',
        loanAmount: '',
        remainingAmount: '',
        APR: '',
    })

    useEffect(() => {
        setHelpText({
            loanTitle: '',
            monthlyPayment: '',
            loanAmount: '',
            remainingAmount: '',
            APR: '',
        })
    }, [])

    useEffect(() => {
        if (dataItem) {
            setLoanData({
                id: entryId,
                loanTitle: dataItem.loanTitle || '',
                monthlyPayment: dataItem.monthlyPayment || '0.00',
                loanAmount: dataItem.loanAmount || '0.00',
                remainingAmount: dataItem.remainingAmount || '0.00',
                APR: dataItem.APR || '0.00',
            })
        }
    }, [dataItem])

    const handleTextChange = (key, e) => {
        const { text } = e.nativeEvent;
        setHelpText({ ...helpText, [key]: '' });
        setLoanData({ ...loanData, [key]: text });
    }

    const handleAmountSet = (key, e) => {
        e.preventDefault()
        e.stopPropagation()
        const { text } = e.nativeEvent
        const isDeletion = text.length < loanData[key].length
        if (!isDeletion && (text.endsWith('-') || text.endsWith('.') || text.endsWith(',') || text.endsWith(' '))) return
        if ((!isDeletion || text !== '0.00') && CommonFunctions.isNumber(text)) {
            setLoanData({
                ...loanData,
                [key]: CommonFunctions.sanitizeFiat(e.nativeEvent.text, isDeletion),
            })
            setHelpText({ ...helpText, [key]: '' })
        }
    }

    const saveEntryToDatabase = () => {
        if (entryId !== null) {
            setLoanData({ ...loanData, id: entryId })
        }

        const validateField = (field, fieldName) => {
            if (!loanData[field] || parseFloat(loanData[field]) === 0) {
                setHelpText({ ...helpText, [field]: `**enter a valid ${fieldName.toLowerCase()}` })
                return false
            }
            return true
        }

        if (
            !validateField('loanTitle', 'Title') ||
            !validateField('monthlyPayment', 'Monthly Payment') ||
            !validateField('loanAmount', 'Loan Amount') ||
            !validateField('remainingAmount', 'Remaining Amount') ||
            !validateField('APR', 'APR')
        ) {
            return
        }

        saveLoanEntry(
            loanData,
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
        deleteLoanEntry(
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
        setLoanData({
            loanTitle: '',
            monthlyPayment: '0.00',
            loanAmount: '0.00',
            remainingAmount: '0.00',
            APR: '0.00',
        })
        setHelpText({
            loanTitle: '',
            monthlyPayment: '',
            loanAmount: '',
            remainingAmount: '',
            APR: '',
        })
    }

    return (
        <SafeAreaView style={[globalStyles.safeArea, globalStyles.container]}>
            <KeyboardAvoidingView behavior='position' >
                <ScrollView scrollEnabled={false} style={styles.mainContainer}>
                    <View style={styles.messageContainer}>
                        <Text style={[theme.FONTS.heading]}>Loan Entry</Text>
                        <Text style={[theme.FONTS.body]}>Take charge of your finances!</Text>
                    </View>
                    <View style={styles.entryPanel}>
                        <InputField
                            label='Loan Title'
                            value={loanData.loanTitle}
                            placeholder='Loan Title'
                            keyboardType='default'
                            onChange={(text) => handleTextChange('loanTitle', text)}
                            helpText={helpText.loanTitle}
                            styles={styles}
                            theme={theme}
                        />

                        <InputField
                            label='Monthly Payment $'
                            value={loanData.monthlyPayment.toString()}
                            placeholder='0.00'
                            keyboardType='decimal-pad'
                            onChange={(e) => handleAmountSet('monthlyPayment', e)}
                            helpText={helpText.monthlyPayment}
                            styles={styles}
                            theme={theme}
                        />

                        <InputField
                            label='Loan Amount $'
                            value={loanData.loanAmount.toString()}
                            placeholder='0.00'
                            keyboardType='decimal-pad'
                            onChange={(e) => handleAmountSet('loanAmount', e)}
                            helpText={helpText.loanAmount}
                            styles={styles}
                            theme={theme}
                        />

                        <InputField
                            label='Remaining Amount $'
                            value={loanData.remainingAmount.toString()}
                            placeholder='0.00'
                            keyboardType='decimal-pad'
                            onChange={(e) => handleAmountSet('remainingAmount', e)}
                            helpText={helpText.remainingAmount}
                            styles={styles}
                            theme={theme}
                        />

                        <InputField
                            label='APR (%)'
                            value={loanData.APR.toString()}
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
        </SafeAreaView>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        mainContainer: {
            borderWidth: 1,
            borderColor: theme.COLORS.borderColor,
            paddingTop: theme.SIZES.paddingSmall,
            margin: theme.SIZES.marginXSmall,
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

export default LoanEntryScreen
