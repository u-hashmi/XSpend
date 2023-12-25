import React from "react";
import { View, Text, SafeAreaView } from "react-native";
import globalStyles from "../common/GlobalStyles";
import { IconLibrary, Icons} from "../common/GlobalIcons";

const SettingScreen = () => {
  return (
    <SafeAreaView style={globalStyles.container}>
      <View style={{display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1}}>
        <IconLibrary name={Icons.Setting} size={50} color="#900" />
        <Text>Setting Screen</Text>
      </View>
    </SafeAreaView>
  );
};

export default SettingScreen;