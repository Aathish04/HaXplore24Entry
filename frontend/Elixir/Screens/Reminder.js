import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

const MedReminderScreen = ({ navigation }) => {
    const [imageUri, setImageUri] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [date, setDate] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [medName, setMedName] = useState('');
  
    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      if (!result.cancelled) {
        setImageUri(result.uri);
      }
    };
  
    const handleAddReminder = () => {
      const newReminder = { id: reminders.length, name: medName, time: date };
      setReminders([...reminders, newReminder]);
      schedulePushNotification(newReminder);
      setModalVisible(false);
    };
  
    useEffect(() => {
      (async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      })();
    }, []);
    
    async function schedulePushNotification({ name, time }) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Medicine Reminder",
            body: `Time to take your medicine: ${name}`,
          },
          trigger: { seconds: (time.getTime() - Date.now()) / 1000 },
        });
      }
      
    // Inside the MedReminderScreen component, after the useEffect hook

return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={24} onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Med Reminder</Text>
      </View>
      <TouchableOpacity onPress={pickImage} style={styles.imageInput}>
        {imageUri ? <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} /> : <Text>Select Image</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addButton}>
        <Text>Add New Prescription</Text>
      </TouchableOpacity>
      {reminders.map((reminder) => (
        <View key={reminder.id} style={styles.reminderBox}>
          <Text>{reminder.name}</Text>
          <Text>{reminder.time.toLocaleTimeString()}</Text>
        </View>
      ))}
      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContent}>
          <DateTimePicker value={date} mode="time" onChange={(event, selectedDate) => setDate(selectedDate || date)} />
          <TextInput placeholder="Medicine Name" value={medName} onChangeText={setMedName} style={styles.textInput} />
          <Pressable onPress={handleAddReminder} style={styles.submitButton}>
            <Text>Submit</Text>
          </Pressable>
        </View>
      </Modal>
    </ScrollView>
  );
  
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 20,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 20,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      marginLeft: 10,
    },
    imageInput: {
      backgroundColor: '#f0f0f0',
      width: '90%',
      height: 200,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    addButton: {
      marginVertical: 10,
      backgroundColor: '#add8e6',
      padding: 10,
      borderRadius: 5,
      alignSelf: 'center',
    },
    reminderBox: {
      backgroundColor: '#e0ffff',
      padding: 10,
      borderRadius: 10,
      width: '90%',
      alignSelf: 'center',
      marginBottom: 10,
    },
    modalContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    textInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      width: '80%',
      padding: 10,
      marginBottom: 20,
    },
    submitButton: {
      backgroundColor: '#90ee90',
      padding: 10,
      borderRadius: 5,
    },
  });
  
export default MedReminderScreen;