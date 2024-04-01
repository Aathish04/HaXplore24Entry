import React, { useState } from 'react';
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
  const [language, setLanguage] = useState('hi'); // Initialize language state

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>

        <Stack.Screen name="Home" screenOptions={{ headerShown: false }}>
          {props => <HomePage {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="MedicalRecords" screenOptions={{ headerShown: false }}>
          {props => <MedicalRecordsPage {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" screenOptions={{ headerShown: false }}>
          {props => <SettingsPage {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="MedReminder" screenOptions={{ headerShown: false }}>
          {props => <MedReminderScreen {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="UpdateVitals" screenOptions={{ headerShown: false }}>
          {props => <UpdateVitals {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="Login" screenOptions={{ headerShown: false }}>
          {props => <Login {...props} setLanguage={setLanguage} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="Camera" screenOptions={{ headerShown: false }}>
          {props => <VideoRecorder {...props} language={language} />}
        </Stack.Screen>
        <Stack.Screen name="UpdateManually" screenOptions={{ headerShown: false }}>
          {props => <UpdateManually {...props} language={language} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
