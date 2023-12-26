import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import LoansScreen from "../screens/LoansScreen";
import SettingScreen from "../screens/SettingScreen";
import EntryScreen from "../home/EntryScreen";
import LoanEntryScreen from "../loans/LoanEntryScreen";
import CreditCardEntry from "../loans/CreditCardEntry";
import { ThemeContext } from '../common/GlobalTheme';
import { Icons, IconLibrary } from "../common/GlobalIcons";
import { BlurView } from 'expo-blur';

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const LoansStack = createStackNavigator();

const HomeStackNavigator = () => {
    const { theme } = useContext(ThemeContext);
  
    return (
      <HomeStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <HomeStack.Screen name="Home" component={HomeScreen} />
        <HomeStack.Screen name="EntryScreen" component={EntryScreen} />
      </HomeStack.Navigator>
    );
  };

  const LoanStackNavigator = () => {
    const { theme } = useContext(ThemeContext);
  
    return (
      <LoansStack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <LoansStack.Screen name="LoansScreen" component={LoansScreen} />
        <LoansStack.Screen name="LoanEntryScreen" component={LoanEntryScreen} />
        <LoansStack.Screen name="CreditCardEntry" component={CreditCardEntry} />
      </LoansStack.Navigator>
    );
  };

const MainNavigator = () => {
  const { theme } = useContext(ThemeContext);
  const NAVBAR = theme.NAVBAR;
  const COLORS = theme.COLORS;
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "HomeStack") {
              iconName = focused ? Icons.Home : Icons.HomeOutline;
            } else if (route.name === "LoanStack") {
              iconName = focused ? Icons.Loan : Icons.LoanOutline;
            } else if (route.name === "Setting") {
              iconName = focused ? Icons.Setting : Icons.SettingOutline;
            }
            return <IconLibrary name={iconName} size={NAVBAR.iconSize} color={color} />;
          },
          tabBarActiveTintColor: NAVBAR.iconColor,
          tabBarInactiveTintColor: NAVBAR.iconInactiveColor,
          tabBarShowLabel: false,
          tabBarStyle: { position: 'absolute' },
          tabBarBackground: () => (
            <BlurView
              style={{ flex: 1 }}
              tint="light"
              intensity={100} 
            />
          ),
          headerShown: false
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="LoanStack" component={LoanStackNavigator} />
        <Tab.Screen name="Setting" component={SettingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;