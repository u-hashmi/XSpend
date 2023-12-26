import React, { useState, useEffect, useContext, useCallback } from 'react'
import { View, SafeAreaView } from 'react-native'
import { useFocusEffect } from '@react-navigation/native'

import GlobalStyles from '../common/GlobalStyles'
import { ThemeContext } from '../common/GlobalTheme'
import LoansList from '../loans/LoansList'
import { getCardEntries, getLoanEntries } from '../../database/Database'
import CreditCardList from '../loans/CreditCardList'
import LoansSummary from '../loans/LoansSummary'

const AboutScreen = ({ navigation }) => {
    const [loanData, setLoanData] = useState([])
    const [cardsData, setCardsData] = useState([])
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)

    const handleNavigateToCreditEntry = (item) => {
        navigation.navigate('CreditCardEntry', { dataItem: item })
    }

    const handleNavigateToEntryScreen = (item) => {
        navigation.navigate('LoanEntryScreen', { dataItem: item })
    }

    useEffect(() => {
        getLoanEntries(
            (entries) => {
                setLoanData(entries)
            },
            (error) => {
                console.error('Error fetching entries:', error)
            },
        );
        getCardEntries(
            (entries) => {
                setCardsData(entries)
            },
            (error) => {
                console.error('Error fetching entries:', error)
            },
        )
    }, [])

    useFocusEffect(
        useCallback(() => {
            getLoanEntries(
                (entries) => {
                    setLoanData(entries)
                },
                (error) => {
                    console.error('Error fetching entries:', error)
                },
            );
            getCardEntries(
                (entries) => {
                    setCardsData(entries)
                },
                (error) => {
                    console.error('Error fetching entries:', error)
                },
            )
        }, []),
    )

    return (
        <SafeAreaView style={globalStyles.safeArea}>
            <View style={globalStyles.container}>
                <CreditCardList cardsData={cardsData} handleNavigateToCreditEntry={handleNavigateToCreditEntry} />
                <LoansSummary />
                <LoansList loanData={loanData} handleNavigateToEntryScreen={handleNavigateToEntryScreen} />
            </View>
        </SafeAreaView>
    )
}

export default AboutScreen
