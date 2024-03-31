import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './Screens/Home';
import MedicalRecordsPage from './Screens/MedicalRecords';
import SettingsPage from './Screens/Settings';
import MedReminderScreen from './Screens/Reminder';

import Login from './Screens/Login';
import UpdateVitals from './Screens/UpdateVitals';
import VideoRecorder from './Screens/Camera';
import UpdateManually from './Screens/UpdateManually';

// Create the stack navigator
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }}/>
        <Stack.Screen name="MedicalRecords" component={MedicalRecordsPage}  options={{ headerShown: false }}/>
        <Stack.Screen name="Settings" component={SettingsPage} options={{headerShown:false}}/>
        <Stack.Screen name="MedReminder" component={MedReminderScreen} options={{headerShown:false}}/>
        <Stack.Screen name="UpdateVitals" component={UpdateVitals} options={{headerShown:false}}/>
        <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
        <Stack.Screen name="Camera" component={VideoRecorder} options={{headerShown:false}}/>
        <Stack.Screen name="UpdateManually" component={UpdateManually} options={{headerShown:false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
