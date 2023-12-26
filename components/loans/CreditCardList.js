// PaymentsSection.js

import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import { ThemeContext } from '../common/GlobalTheme'
import GlobalStyles from '../common/GlobalStyles'
import CommonFunctions from '../common/CommonFunctions'
import NoDataSVG from '../../assets/svgs/noDataSVG.svg'

const CreditCardList = ({ cardsData, handleNavigateToCreditEntry }) => {
    const { theme } = useContext(ThemeContext)
    const globalStyles = GlobalStyles(theme)
    const styles = getStyles(theme)

    const renderPaymentItem = ({ item }) => {
        return (
            <TouchableOpacity style={styles.cardStyle} onPress={() => handleNavigateToCreditEntry(item)}>
                <View style={[globalStyles.flexColumn, styles.cardMain]}>
                    <View>
                        <Text style={[theme.FONTS.heading]}>{item.cardTitle}</Text>
                    </View>
                    <View style={[globalStyles.flexRow, styles.groupedSection]}>
                        <View>
                            <Text style={[theme.FONTS.caption]}>Monthly Payment</Text>
                            <Text style={[theme.FONTS.subHeading]}>${item.monthlyPayment}</Text>
                        </View>
                        <View style={[globalStyles.textLeft]}>
                            <Text style={[theme.FONTS.caption]}>Balance ($)</Text>
                            <Text style={[theme.FONTS.subHeading]}>
                                ${item.cardBalance}/{item.limit}
                            </Text>
                        </View>
                    </View>
                    <View style={[globalStyles.flexRow, styles.groupedSection]}>
                        <View>
                            <Text style={[theme.FONTS.caption]}>APR</Text>
                            <Text style={[theme.FONTS.subHeading]}>{item.APR}%</Text>
                        </View>
                        <View style={globalStyles.textLeft}>
                            <Text style={[theme.FONTS.caption]}>Usage</Text>
                            <Text style={[theme.FONTS.subHeading]}>{((item.cardBalance / item.limit) * 100).toFixed(2)}%</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }

    return (
        <View>
            <View style={[globalStyles.flexRow, globalStyles.sectionHeader, styles.headerSection]}>
                <Text style={theme.FONTS.heading}>Credit Cards</Text>
                <TouchableOpacity onPress={() => handleNavigateToCreditEntry(null)}>
                    <IconLibrary name={Icons.AddIcon} size={theme.SIZES.fontLarge} color={theme.COLORS.primary} />
                </TouchableOpacity>
            </View>
            <View style={[globalStyles.noMargin, styles.flatListContainer]}>
                {cardsData.length === 0 ? (
                    <View style={[globalStyles.flexColumn, styles.messageContainer]}>
                        <NoDataSVG width={200} height={200} />
                        <Text style={theme.FONTS.heading}>No Loans Added!</Text>
                    </View>
                ) : (
                    <FlatList data={cardsData} renderItem={renderPaymentItem} showsHorizontalScrollIndicator={false} horizontal={true} />
                )}
            </View>
        </View>
    )
}

const getStyles = (theme) =>
    StyleSheet.create({
        headerSection: {
            borderBottomWidth: theme.SIZES.borderWidth,
            borderColor: theme.COLORS.borderColor,
            paddingTop: theme.SIZES.marginSmall,
            paddingHorizontal: theme.SIZES.paddingSmall,
            marginHorizontal: -theme.SIZES.marginSmall
        },
        sectionHeader: {
            flex: 2,
            justifyContent: 'space-between',
            borderBottomWidth: theme.SIZES.borderWidth,
            paddingBottom: theme.SIZES.paddingSmall,
            marginBottom: theme.SIZES.marginSmall,
        },
        groupedSection: {
            justifyContent: 'space-between',
        },
        detailSection: {
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: theme.SIZES.paddingXSmall,
        },
        flatListContainer: {
            backgroundColor: theme.COLORS.white,
            marginHorizontal: -theme.SIZES.marginSmall,
            borderColor: theme.COLORS.borderColor,
            borderBottomWidth: theme.SIZES.borderWidth,
            marginBottom: theme.SIZES.marginSmall,
            backgroundColor: theme.COLORS.lightAccent
        },
        cardMain: {
            flex: 1,
            justifyContent: 'space-between',
            paddingVertical: theme.SIZES.paddingXSmall,
        },
        cardStyle: {
            width: 280,
            height: 180,
            flex: 1,
            backgroundColor: theme.COLORS.white,
            borderRadius: theme.SIZES.radiusSmall,
            paddingHorizontal: theme.SIZES.paddingSmall,
            paddingVertical: theme.SIZES.paddingXSmall,
            marginVertical: theme.SIZES.marginSmall,
            marginHorizontal: theme.SIZES.marginXSmall,
            borderColor: theme.COLORS.borderColor,
            ...theme.SHADOWS.mainShadow,
            borderWidth: theme.SIZES.borderWidth * 5,
        },
        messageContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    })

export default CreditCardList
