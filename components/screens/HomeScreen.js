import React, { useState, useEffect, useContext, useCallback} from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, TextInput } from 'react-native'
import { useFocusEffect } from '@react-navigation/native';
import GlobalStyles from '../common/GlobalStyles'
import { IconLibrary, Icons } from '../common/GlobalIcons'
import PayCheckData from '../../database/DemoPaycheckData'
import { ThemeContext } from '../common/GlobalTheme'
import data from '../../database/DemoPaymentsData'
import SummaryRender from '../home/SummaryRender'
import WelcomeBox from '../home/WelcomeBox'
import SubtotalRender from '../home/SubTotalRender'
import PaymentsList from '../home/PaymentsList'
import EntryScreen from '../home/EntryScreen'
import { getEntries } from '../../database/Database'
import { useNavigation } from '@react-navigation/native';

const HomeScreen = ({navigation}) => {
  const [paycheckAmount, setPaycheckAmount] = useState(PayCheckData.perPayCheck)
  const [paymentsData, setPaymentsData] = useState([])
  const [monthlyTotal, setMonthlyTotal] = useState(0)
  const [total, setTotal] = useState(0)
  const [unpaidTotal, setUnpaidTotal] = useState(0)
  const [filterState, setFilterState] = useState('All')

  const handleNavigateToEntryScreen = (item) => {
    navigation.navigate('EntryScreen', { dataItem: item });
  };

  const handleFilterChange = (value) => {
    setFilterState(value)
  }
  

  useEffect(() => {
    // Fetch entries from the database
    getEntries(
      (entries) => {
        setPaymentsData(entries)
      },
      (error) => {
        console.error('Error fetching entries:', error)
      },
    )
  }, [])

  useFocusEffect(
    useCallback(() => {
      // Fetch entries from the database when the screen comes into focus
      getEntries(
        (entries) => {
          setPaymentsData(entries);
        },
        (error) => {
          console.error('Error fetching entries:', error);
        },
      );
    }, []),
  );

  const username = 'Usama'
  const { theme } = useContext(ThemeContext)
  const globalStyles = GlobalStyles(theme)
  const handlePaid = (id) => {
    const updatedData = paymentsData.map((item) => {
      if (item.id === id) {
        item.isPaid = !item.isPaid
      }
      return item
    })
    setPaymentsData(updatedData)
  }

  const getFilteredData = (state) => {
    setFilterState(state)
    switch(filterState) {
        case 'firstHalf':
            return paymentsData.filter((item) => item.dueDate <= 15)
        case 'secondHalf':
            return paymentsData.filter((item) => item.dueDate > 15)
        case 'Misc':
            return paymentsData.filter((item) => item.category === 'Misc')
        case 'Credit':
            return paymentsData.filter((item) => item.category === 'Credit')
        case 'Utility':
            return paymentsData.filter((item) => item.category === 'Utility')
        case 'Loan':
            return paymentsData.filter((item) => item.category === 'Loan')
        default:
            return paymentsData
        }
    }

  const calculateTotal = () => {
    let calculatedTotal = 0
    let calculatedUnpaidTotal = 0
    let calculatedMonthlyTotal = 0

    const filteredData = getFilteredData();

    filteredData.forEach((item) => {
      if (item.isPaid) {
        calculatedTotal += item.amount
      } else {
        calculatedUnpaidTotal += item.amount
      }
    })

    paymentsData.forEach((item) => {
      calculatedMonthlyTotal += item.amount
    })

    setMonthlyTotal(calculatedMonthlyTotal.toFixed(2))
    setTotal(calculatedTotal.toFixed(2))
    setUnpaidTotal(calculatedUnpaidTotal.toFixed(2))
  }
  useEffect(() => {
    calculateTotal()
  }, [paymentsData, filterState])
  return (
    <SafeAreaView style={globalStyles.safeArea}>
      <View style={globalStyles.container}>
        <WelcomeBox username={username} />

        <SummaryRender
          paycheckAmount={paycheckAmount}
          monthlyTotal={monthlyTotal}
          total={total}
          setPaycheckAmount={setPaycheckAmount}
        />
        <PaymentsList
          paycheckAmount={paycheckAmount}
          paymentsData={paymentsData}
          handlePaid={handlePaid}
          handleFilterChange={handleFilterChange}
          handleNavigateToEntryScreen={handleNavigateToEntryScreen}
          getFilteredData={getFilteredData}
        />
        <SubtotalRender paidTotal={total} unpaidTotal={unpaidTotal} />
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen
