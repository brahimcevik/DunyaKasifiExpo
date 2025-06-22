import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text } from 'react-native';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';
import AvatarScreen from '../screens/Avatar/AvatarScreen';
import EquipmentScreen from '../screens/Equipment/EquipmentScreen';
import VehicleScreen from '../screens/Vehicle/VehicleScreen';
import OathScreen from '../screens/Oath/OathScreen';
import MapScreen from '../screens/Map/MapScreen';
import ParisARExperience from '../screens/AR/ParisARExperience';
import LondonARExperience from '../screens/AR/LondonARExperience.js';
import MapDetectiveGame from '../screens/MiniGames/MapDetectiveGame';
import CloudPaintGame from '../screens/MiniGames/CloudPaintGame';
import PassportScreen from '../screens/Progress/PassportScreen';
import InfoCardScreen from '../screens/Info/InfoCardScreen';
import SummaryScreen from '../screens/Summary/SummaryScreen';

console.log("LondonARExperience =>", LondonARExperience);

const Stack = createNativeStackNavigator();

function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Ana Sayfa</Text>
    </View>
  );
}

const AppNavigator = () => {
  return (
  <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Avatar" component={AvatarScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Equipment" component={EquipmentScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Vehicle" component={VehicleScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Oath" component={OathScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Map" component={MapScreen} options={{ headerShown: false }} />
      <Stack.Screen name="ParisARExperience" component={ParisARExperience} />
      <Stack.Screen name="LondonARExperience" component={LondonARExperience} />
      <Stack.Screen name="MapDetectiveGame" component={MapDetectiveGame} />
      <Stack.Screen name="CloudPaintGame" component={CloudPaintGame} />
      <Stack.Screen name="InfoCardScreen" component={InfoCardScreen} />
      <Stack.Screen name="Passport" component={PassportScreen} />
      <Stack.Screen name="Summary" component={SummaryScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);
};

export default AppNavigator;