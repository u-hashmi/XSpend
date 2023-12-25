// PaymentsSection.js

import React, { useState, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView, Image } from 'react-native'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import { ThemeContext } from '../common/GlobalTheme'
import GlobalStyles from '../common/GlobalStyles'
import CommonFunctions from '../common/CommonFunctions'
import NoDataSVG from '../../assets/svgs/noDataSVG.svg'

const PaymentList = ({
  handlePaid,
  handleFilterChange,
  handleNavigateToEntryScreen,
  getFilteredData,  
}) => {
  const { theme } = useContext(ThemeContext)
  const globalStyles = GlobalStyles(theme)
  const styles = getStyles(theme)
  const [filterState, setFilterState] = useState('All')
  const [filteredData, setFilteredData] = useState([])

  const getColorAndIcon = (category) => {
    let transparency = '33'
    return (
      <View
        style={[
          globalStyles.iconContainer,
          { backgroundColor: theme.ICON_COLORS.mainColor + transparency },
        ]}
      >
        <IconLibrary name={Icons[category]} size={24} color={theme.ICON_COLORS.mainColor} />
      </View>
    )
  }

  const renderPaymentItem = ({ item }) => {
    var dueDateSuffix = CommonFunctions.getDueDateSuffix(item.dueDate)
    return (
      <TouchableOpacity style={styles.cardStyle} onPress={() => handleNavigateToEntryScreen(item)}>
        <View>{getColorAndIcon(item.category)}</View>
        <View style={[globalStyles.flexRow, { flex: 1 }]}>
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <Text style={theme.FONTS.caption}>Title</Text>
            <Text style={theme.FONTS.subHeading}>{item.title}</Text>
          </View>
          <View style={{ flex: 0.5 }}>
            <Text style={theme.FONTS.caption}>Due</Text>
            <Text style={theme.FONTS.subHeading}>
              {item.dueDate}
              <Text style={globalStyles.superScriptStyle}>{dueDateSuffix}</Text>
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={theme.FONTS.caption}>Amount</Text>
            <Text style={theme.FONTS.subHeading}>${item.amount}</Text>
          </View>
          <TouchableOpacity onPress={() => handlePaid(item.id)}>
            <IconLibrary
              name={item.isPaid ? Icons.Checked : Icons.Unchecked}
              size={24}
              color={theme.COLORS.primary}
            />
          </TouchableOpacity>
        </View>
        <View style={globalStyles.alignLeft}></View>
      </TouchableOpacity>
    )
  }

  const handleFilterStateChange = (state) => {
    setFilterState(state)
    handleFilterChange(state)
  }

  useEffect(() => {
    const initialData = getFilteredData(filterState);
    setFilteredData(initialData);
  }, []);

  useEffect(() => {
    const updatedData = getFilteredData(filterState);
    setFilteredData(updatedData);
  }, [filterState]);

  const generateFilterItem = (type, label, icon) => (
    <TouchableOpacity
      onPress={() => handleFilterStateChange(type)}
      style={[
        styles.filterBarItems,
        styles.filterBarIconStyle,
        filterState === type ? styles.backgroundFilled : styles.backgroundEmpty,
      ]}
    >
      {icon && (
        <IconLibrary
          name={icon}
          size={theme.SIZES.fontLarge}
          color={filterState === type ? theme.COLORS.white : theme.COLORS.primary}
        />
      )}
      <Text style={[filterState === type ? styles.fontFilled : styles.fontEmpty]}>{label}</Text>
    </TouchableOpacity>
  )

  const getFilterBarItems = () => (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={[styles.filterBar]}>
        {generateFilterItem('All', 'All')}
        {generateFilterItem('firstHalf', '1st Half')}
        {generateFilterItem('secondHalf', '2nd Half')}
        {generateFilterItem('Misc', 'Misc', Icons.Misc)}
        {generateFilterItem('Utility', 'Utility', Icons.Utility)}
        {generateFilterItem('Loan', 'Loans', Icons.Loan)}
        {generateFilterItem('Credit', 'Credit', Icons.Credit)}
      </View>
    </ScrollView>
  )

  return (
    <View>
      <View style={[globalStyles.flexRow, globalStyles.sectionHeader]}>
        <Text style={theme.FONTS.heading}>Payments</Text>
        <TouchableOpacity onPress={() => handleNavigateToEntryScreen(null)}>
          <IconLibrary
            name={Icons.AddIcon}
            size={theme.SIZES.fontLarge}
            color={theme.COLORS.primary}
          />
        </TouchableOpacity>
      </View>
      <View style={[styles.filterBarContainer]}>{getFilterBarItems()}</View>
      <View style={styles.flatListContainer}>
        {filteredData.length === 0 ? (
          <View style={[globalStyles.flexColumn, styles.messageContainer]}>
            <NoDataSVG width={200} height={200} />
            <Text style={theme.FONTS.heading}>No Data</Text>
          </View>
        ) : (
          <FlatList
            data={filteredData}
            renderItem={renderPaymentItem}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </View>
  )
}

const getStyles = (theme) =>
  StyleSheet.create({
    filterBarContainer: {
      marginHorizontal: -theme.SIZES.marginSmall,
      padding: 0
    },
    filterBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      padding: 0,
    },
    filterBarItems: {
      display: 'flex',
      flex: 1,
      paddingVertical: theme.SIZES.paddingXSmall,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.SIZES.radiusXSmall,
      color: theme.COLORS.white,
    },
    flatListContainer: {
      height: 435,
      borderBottomWidth: 0.2,
      marginHorizontal: -theme.SIZES.marginSmall,
      paddingHorizontal: theme.SIZES.paddingXSmall,
      borderColor: theme.COLORS.borderColor,
    },
    cardStyle: {
      backgroundColor: theme.COLORS.white,
      borderRadius: theme.SIZES.radiusSmall,
      padding: theme.SIZES.paddingSmall,
      marginVertical: theme.SIZES.marginXSmall,
      marginBottom: theme.SIZES.marginXSmall / 2,
      borderWidth: 1,
      borderColor: theme.COLORS.borderColor,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      shadowColor: theme.COLORS.black,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
    },
    backgroundEmpty: {},
    backgroundFilled: {
      backgroundColor: theme.COLORS.primary,
    },
    fontEmpty: {
      ...theme.FONTS.body,
      color: theme.COLORS.primary,
    },
    fontFilled: {
      ...theme.FONTS.body,
      color: theme.COLORS.white,
    },
    filterBarIconStyle: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      height: 40,
      width: 80,
      borderColor: theme.COLORS.borderColor,
      padding: theme.SIZES.paddingXSmall,
      margin: theme.SIZES.marginXSmall,
      borderRadius: theme.SIZES.radiusSmall,
    },
    messageContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
  })

export default PaymentList
