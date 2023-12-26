// PaymentsSection.js

import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import { ThemeContext } from '../common/GlobalTheme'
import GlobalStyles from '../common/GlobalStyles'
import CommonFunctions from '../common/CommonFunctions'
import NoDataSVG from '../../assets/svgs/noDataSVG.svg'

const LoansList = ({  loanData, handleNavigateToEntryScreen }) => {
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)
    const styles = getStyles(theme)

    const renderPaymentItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.cardStyle} onPress={() => handleNavigateToEntryScreen(item)}>
                <View style={[globalStyles.flexColumn, { flex: 1 }]}>
                    <View style={[globalStyles.flexRow, styles.sectionHeader]}>
                        <View>
                            <Text style={theme.FONTS.heading}>{item.loanTitle}</Text>
                            <Text style={theme.FONTS.body}>${item.monthlyPayment} Monthly Payment</Text>
                        </View>
                        <View style={[globalStyles.flexRow]}>
                            <View style={styles.APRBlock}>
                                <Text style={[theme.FONTS.caption, theme.FONTS.fontColorWhite]}>APR</Text>
                                <Text style={[theme.FONTS.subHeading, theme.FONTS.fontColorWhite, styles.dataItemBlock]}>{item.APR}%</Text>
                            </View>
                            <View style={styles.APRBlock}>
                                <Text style={[theme.FONTS.caption, theme.FONTS.fontColorWhite]}>Remaining Payments</Text>
                                <Text style={[theme.FONTS.subHeading, theme.FONTS.fontColorWhite, styles.dataItemBlock]}>
                                    {Math.round(item.remainingAmount / item.monthlyPayment).toFixed(0)}
                                </Text>
                            </View>
                        </View>
                    </View>
                    <View style={[globalStyles.flexRow, styles.detailSection]}>
                        <View>
                            <Text style={theme.FONTS.caption}>Initial Loan Amount</Text>
                            <Text style={theme.FONTS.subHeading}>${item.loanAmount}</Text>
                        </View>
                        <View style={globalStyles.textLeft}>
                            <Text style={theme.FONTS.caption}>Remaining Loan Amount</Text>
                            <Text style={theme.FONTS.subHeading}>${item.remainingAmount}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={[globalStyles.flexRow, globalStyles.sectionHeader, styles.headerSection]}>
                <Text style={theme.FONTS.heading}>Loans</Text>
                <TouchableOpacity onPress={() => handleNavigateToEntryScreen(null)}>
                    <IconLibrary name={Icons.AddIcon} size={theme.SIZES.fontLarge} color={theme.COLORS.primary} />
                </TouchableOpacity>
            </View>
            <View style={styles.flatListContainer}>
                {loanData.length === 0 ? (
                    <View style={[globalStyles.flexColumn, styles.messageContainer]}>
                        <NoDataSVG width={200} height={200} />
                        <Text style={theme.FONTS.heading}>No Loans Added!</Text>
                    </View>
                ) : (
                    <FlatList data={loanData} renderItem={renderPaymentItem} showsVerticalScrollIndicator={false} />
                )}
            </View>
        </View>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        headerSection: {
            borderTopWidth: theme.SIZES.borderWidth,
            borderColor: theme.COLORS.borderColor,
            paddingTop: theme.SIZES.marginSmall,
            paddingHorizontal: theme.SIZES.paddingSmall,
            marginHorizontal: -theme.SIZES.marginSmall,
            
        },
        sectionHeader: {
            flex: 2,
            justifyContent: 'space-between',
            borderBottomWidth: theme.SIZES.borderWidth,
            paddingBottom: theme.SIZES.paddingSmall,
            marginBottom: theme.SIZES.marginSmall,
        },
        APRBlock: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: theme.SIZES.paddingSmall,
            borderWidth: theme.SIZES.borderWidth,
            borderRadius: theme.SIZES.radiusSmall,
            backgroundColor: theme.COLORS.primary,
            marginLeft: theme.SIZES.marginXSmall,
        },
        dataItemBlock: {
            marginLeft: theme.SIZES.marginXSmall,
        },
        detailSection: {
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: theme.SIZES.paddingXSmall,
        },
        flatListContainer: {
            height: 410,
            borderBottomWidth: theme.SIZES.borderWidth * 2,
            borderTopWidth: theme.SIZES.borderWidth,
            marginHorizontal: -theme.SIZES.marginSmall,
            paddingHorizontal: theme.SIZES.paddingXSmall,
            borderColor: theme.COLORS.borderColor,
            backgroundColor: theme.COLORS.lightAccent
        },
        cardStyle: {
            backgroundColor: theme.COLORS.white,
            borderRadius: theme.SIZES.radiusSmall,
            padding: theme.SIZES.paddingSmall,
            marginVertical: theme.SIZES.marginXSmall,
            marginBottom: theme.SIZES.marginXSmall / 2,
            borderColor: theme.COLORS.borderColor,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            ...theme.SHADOWS.mainShadow,
            borderWidth: theme.SIZES.borderWidth,
        },
        messageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    })

export default LoansList
