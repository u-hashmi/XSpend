import React, { useState, useContext, useEffect } from 'react'
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    StyleSheet,
    FlatList,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native'
import GlobalStyles from '../common/GlobalStyles'
import { ThemeContext } from '../common/GlobalTheme'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import { saveEntry, deleteEntry } from '../../database/Database'
import CommonFunctions from '../common/CommonFunctions'

const EntryScreen = ({ navigation, route }) => {
    const { dataItem } = route.params
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)
    const styles = getStyles(theme)
    const [entryId, setEntryId] = useState(dataItem?.id || null)
    const [isPaid, setIsPaid] = useState(false)
    const [amount, setAmount] = useState('0.00') // Default value should be a string
    const [category, setCategory] = useState('')
    const [dueDate, setDueDate] = useState(1)
    const [title, setTitle] = useState('')
    const [categoryHelp, setCategoryHelp] = useState('')
    const [titleHelp, setTitleHelp] = useState('')
    const [amountHelp, setAmountHelp] = useState('')
    const imageURI = theme.COLORS.primary === theme.COLORS.isLight ? require('../../assets/backgrounds/cardBG.png') : require('../../assets/backgrounds/cardBGDark.png')
    const [dataObject, setDataObject] = useState({
        id: entryId,
        title: (dataItem && dataItem.title) || '',
        amount: (dataItem && dataItem.amount) || 0,
        category: (dataItem && dataItem.category) || '',
        dueDate: (dataItem && dataItem.dueDate) || 1,
        isPaid: (dataItem && dataItem.isPaid) || false,
    })

    useEffect(() => {
        setCategoryHelp('')
        setTitleHelp('')
        setAmountHelp('')
    }, [])

    useEffect(() => {
        if (dataItem) {
            setCategory(dataItem.category || '')
            setTitle(dataItem.title || '')
            setAmount(dataItem.amount?.toString() || '0.00')
            setDueDate(dataItem.dueDate || 1)
            setIsPaid(dataItem.isPaid || false)
        }
    }, [dataItem])

    const options = ['Credit', 'Loan', 'Misc', 'Utility']

    const handleCategorySelect = (value) => {
        setCategoryHelp('')
        setCategory(value)
        setDataObject({ ...dataObject, category: value })
    }

    const handleTitleSet = (value) => {
        setTitleHelp('')
        setTitle(value)
        setDataObject({ ...dataObject, title: value })
    }

    const handleAmountSet = (e) => {
        e.preventDefault()
        e.stopPropagation()
        const { text } = e.nativeEvent
        const isDeletion = text.length < amount.length
        if (!isDeletion && (text.endsWith('-') || text.endsWith('.') || text.endsWith(',') || text.endsWith(' '))) return
        if ((!isDeletion || text !== '0.00') && CommonFunctions.isNumber(text))
            setAmount(CommonFunctions.sanitizeFiat(e.nativeEvent.text, isDeletion))
        setDataObject({
            ...dataObject,
            amount: CommonFunctions.sanitizeFiat(e.nativeEvent.text, isDeletion),
        })
    }

    const handleDueDaySelect = ({ item }) => {
        setDueDate(parseInt(item))
        setDataObject({ ...dataObject, dueDate: parseInt(item) })
    }

    const handleIsPaid = () => {
        setIsPaid(!isPaid)
        setDataObject({ ...dataObject, isPaid: !isPaid })
    }

    const saveEntryToDatabase = () => {
        // If entryId exists, set it in the dataObject
        if (entryId !== null) {
            setDataObject({ ...dataObject, id: entryId })
        }

        // Validation checks
        if (!category) {
            setCategoryHelp('**select a category')
            return
        } else {
            setCategoryHelp('')
        }

        if (!title) {
            setTitleHelp('**enter a title')
            return
        } else {
            setTitleHelp('')
        }

        if (!amount || parseFloat(amount) === 0) {
            setAmountHelp('**enter a valid amount')
            return
        } else {
            setAmountHelp('')
        }

        saveEntry(
            dataObject,
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
        deleteEntry(
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
                            <Text style={[theme.FONTS.subHeading, { color: option === category ? theme.COLORS.white : theme.COLORS.primary }]}>
                                {option}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        )
    }

    const resetEntry = () => {
        setCategory('')
        setTitle('')
        setAmount('0.00')
        setDueDate(1)
        setIsPaid(false)
        setCategoryHelp('')
        setTitleHelp('')
        setAmountHelp('')
        setDataObject({
            title: '',
            amount: 0,
            category: '',
            dueDate: 1,
            isPaid: false,
        })
    }

    return (
        <SafeAreaView style={[globalStyles.safeArea, globalStyles.container]}>
            <KeyboardAvoidingView behavior='position'>
                <ScrollView>
                    <View style={styles.imageContainer}>
                        <ImageBackground source={imageURI} style={styles.image} >
                        <Text style={[theme.FONTS.heading, theme.FONTS.fontColorWhite]}>Spending Entry</Text>
                        <Text style={[theme.FONTS.body, theme.FONTS.fontColorWhite]}>Take charge of your finances!</Text>
                        </ImageBackground>
                    </View>
                    <View style={styles.entryPanel}>
                        <View style={[globalStyles.flexRow, { justifyContent: 'space-between' }]}>
                            <Text style={[theme.FONTS.subHeading, styles.titleStyle]}>Select Category</Text>
                            <TouchableOpacity onPress={resetEntry}>
                                <IconLibrary name={Icons.ResetIcon} size={theme.SIZES.fontLarge} color={theme.COLORS.primary} />
                            </TouchableOpacity>
                        </View>
                        {generateCategorySelector()}
                        <Text style={styles.helpTextStyle}>{categoryHelp}</Text>
                        <Text style={[theme.FONTS.subHeading, styles.titleStyle]}>Title</Text>
                        <TextInput
                            placeholder='Title'
                            returnKeyType='done'
                            placeholderTextColor={theme.COLORS.fontThemeSub}
                            value={title}
                            onChangeText={(text) => handleTitleSet(text)}
                            style={[theme.FONTS.subHeading, styles.textInput]}
                            maxLength={16}
                        />
                        <Text style={styles.helpTextStyle}>{titleHelp}</Text>
                        <View style={globalStyles.flexRow}>
                        <Text style={[theme.FONTS.subHeading, styles.titleStyle]}>Amount Due</Text>
                        <Text style={styles.helpTextStyle}>{amountHelp}</Text>
                        </View>
                        <TextInput
                            keyboardType='decimal-pad'
                            placeholder='Amount'
                            returnKeyType='done'
                            placeholderTextColor={theme.COLORS.fontThemeSub}
                            value={amount}
                            onTextInput={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                            }}
                            onChange={handleAmountSet}
                            style={[theme.FONTS.subHeading, styles.textInput]}
                        />
                        
                        <Text style={[theme.FONTS.subHeading, styles.titleStyle]}>
                            Due By - {dueDate}
                            <Text style={globalStyles.superScriptStyle}>{CommonFunctions.getDueDateSuffix(dueDate)}</Text>
                        </Text>
                        <View>
                            <FlatList
                                data={Array.from({ length: 31 }, (_, index) => index + 1)}
                                keyExtractor={(item, index) => index.toString()}
                                style={styles.flatList}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            style={[
                                                styles.item,
                                                {
                                                    backgroundColor: item == dueDate ? theme.COLORS.primary : theme.COLORS.white,
                                                },
                                            ]}
                                            onPress={() => handleDueDaySelect({ item })}
                                        >
                                            <Text style={[styles.itemText, { color: item == dueDate ? theme.COLORS.white : theme.COLORS.primary }]}>
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )
                                }}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>
                        <TouchableOpacity onPress={handleIsPaid}>
                            <View style={globalStyles.flexRow}>
                                <Text style={[theme.FONTS.subHeading, styles.titleStyle]}>Payment Status</Text>
                                <IconLibrary name={isPaid ? Icons.Checked : Icons.Unchecked} size={24} color={theme.COLORS.primary} />
                            </View>
                        </TouchableOpacity>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, theme.SHADOWS.mainShadow, styles.deleteButton]}
                                onPress={deleteEntryFromDatabase}
                            >
                                <Text style={[theme.FONTS.subHeading, { color: theme.COLORS.white }]}>Delete</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={[styles.button, theme.SHADOWS.mainShadow]} onPress={cancelEntry}>
                                <Text style={[theme.FONTS.subHeading, { color: theme.COLORS.white }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.button, theme.SHADOWS.mainShadow]} onPress={saveEntryToDatabase}>
                                <Text style={[theme.FONTS.subHeading, { color: theme.COLORS.white }]}>Save</Text>
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
        entryPanel: {
            flex: 1,
            borderColor: theme.COLORS.borderColor,
            padding: theme.SIZES.paddingSmall,
            borderRadius: theme.SIZES.radiusSmall,
            margin: theme.SIZES.marginSmall,
        },
        textInputLabel: {
            backgroundColor: theme.COLORS.borderColor,
            padding: theme.SIZES.paddingSmall,
            borderTopLeftRadius: theme.SIZES.radiusXSmall,
            borderBottomLeftRadius: theme.SIZES.radiusXSmall,
        },
        container: {
            marginVertical: 10,
        },
        textInput: {
            padding: theme.SIZES.paddingMedium,
            borderRadius: theme.SIZES.radiusSmall,
            fontFamily: 'Gabarito-Regular',
            borderWidth: theme.SIZES.borderWidth,
            marginBottom: theme.SIZES.marginXSmall,
            paddingLeft: theme.SIZES.paddingSmall,
            borderColor: theme.COLORS.borderColor,
            borderTopRightRadius: theme.SIZES.radiusXSmall,
            borderBottomRightRadius: theme.SIZES.radiusXSmall,
        },
        item: {
            backgroundColor: theme.COLORS.borderColor,
            borderRadius: theme.SIZES.radiusSmall,
            padding: theme.SIZES.paddingSmall,
            marginRight: theme.SIZES.marginXSmall,
            marginBottom: theme.SIZES.marginXSmall,
            borderWidth: theme.SIZES.borderWidth,
            borderColor: theme.COLORS.borderColor,
        },
        linearGradient: {
            overflow: 'hidden',
        },
        itemText: {
            color: theme.COLORS.white,
            fontFamily: 'Gabarito-Regular',
        },
        titleStyle: {
            marginRight: theme.SIZES.marginXSmall,
            marginVertical: theme.SIZES.marginSmall,
        },
        mainContainer: {
            marginBottom: theme.SIZES.marginXSmall / 2,
        },
        comboContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
        },
        comboItemStyle: {
            width: '100%',
            flex: 1,
            marginHorizontal: theme.SIZES.marginXSmall / 2,
            borderRadius: theme.SIZES.radiusSmall,
            padding: theme.SIZES.paddingSmall,
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: theme.SIZES.borderWidth,
            borderColor: theme.COLORS.borderColor,
            marginVertical: theme.SIZES.marginXSmall / 2,
            backgroundColor: theme.COLORS.primary,
            ...theme.SHADOWS.mainShadow,
        },
        flatList: {
            height: 50,
            backgroundColor: theme.COLORS.white,
            borderColor: theme.COLORS.borderColor,
            borderWidth: theme.SIZES.borderWidth,
            overflow: 'hidden',
            borderRadius: theme.SIZES.radiusSmall,
            marginBottom: theme.SIZES.marginSmall,
        },
        item: {
            width: 50,
            backgroundColor: theme.COLORS.primary,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 1,
        },
        itemText: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.COLORS.white,
        },
        title: {
            paddingBottom: theme.SIZES.paddingXSmall,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginVertical: theme.SIZES.marginXSmall,
        },
        button: {
            width: 100,
            padding: theme.SIZES.paddingSmall,
            borderRadius: theme.SIZES.radiusSmall,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: theme.COLORS.primary,
            ...theme.SHADOWS.mainShadow,
        },
        deleteButton: {
            backgroundColor: theme.COLORS.red,
        },
        helpTextStyle: {
            ...theme.FONTS.caption,
            color: theme.COLORS.red,
            fontSize: 12,
            fontFamily: 'Gabarito-Regular',
        },
        messageContainer: {
            borderRadius: theme.SIZES.radiusSmall,
            marginHorizontal: theme.SIZES.marginSmall,
            padding: theme.SIZES.paddingXSmall,
        },
        imageContainer: {
          
        },
        image: {
            marginHorizontal: theme.SIZES.marginSmall,
            borderRadius: theme.SIZES.radiusSmall,
            height: 250,
            overflow: 'hidden',
            resizeMode: 'fill',
            justifyContent: 'center',
            padding: theme.SIZES.paddingLarge,
            backgroundColor: theme.COLORS.white,
            ...theme.SHADOWS.mainShadow,
        },
    })

export default EntryScreen
