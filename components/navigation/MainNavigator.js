import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import AboutScreen from "../screens/AboutScreen";
import SettingScreen from "../screens/SettingScreen";
import EntryScreen from "../home/EntryScreen";
import { ThemeContext } from '../common/GlobalTheme';
import { Icons, IconLibrary } from "../common/GlobalIcons";

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

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
            } else if (route.name === "About") {
              iconName = focused ? Icons.About : Icons.AboutOutline;
            } else if (route.name === "Setting") {
              iconName = focused ? Icons.Setting : Icons.SettingOutline;
            }
            return <IconLibrary name={iconName} size={NAVBAR.iconSize} color={color} />;
          },
          tabBarActiveTintColor: NAVBAR.iconColor,
          tabBarInactiveTintColor: NAVBAR.iconInactiveColor,
          tabBarShowLabel: false,
          tabBarStyle: { position: 'absolute', backgroundColor: COLORS.white },
          headerShown: false
        })}
      >
        <Tab.Screen name="HomeStack" component={HomeStackNavigator} />
        <Tab.Screen name="About" component={AboutScreen} />
        <Tab.Screen name="Setting" component={SettingScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;