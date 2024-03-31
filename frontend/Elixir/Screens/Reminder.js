import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, ScrollView, Alert, Image } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Notifications from 'expo-notifications';


Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MedReminderScreen = ({ navigation }) => {

    
    const [image, setImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [time, setTime] = useState(new Date());
    const [reminders, setReminders] = useState([]);
    const [medName, setMedName] = useState('');
    const [editingReminderId, setEditingReminderId] = useState(null);
    const [showPicker, setShowPicker] = useState(false);

    const [formattedTime, setFormattedTime] = useState("");

    useEffect(() => {
    // Format the time as a readable string
    const options = { hour: '2-digit', minute: '2-digit' };
    const timeString = new Date(time).toLocaleTimeString([], options);
    setFormattedTime(timeString);
    }, [time]);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [6, 7],
          quality: 1,
        });
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

    const handleAddOrEditReminder = () => {
        if (editingReminderId !== null) {
            const updatedReminders = reminders.map((reminder) => {
                if (reminder.id === editingReminderId) {
                    return { ...reminder, name: medName, time: time };
                }
                return reminder;
            });
            setReminders(updatedReminders);
        } else {
            const newReminder = { id: reminders.length, name: medName, time: time };
            setReminders([...reminders, newReminder]);
            schedulePushNotification(newReminder);
        }
        setModalVisible(false);
        resetForm();
    };

    const resetForm = () => {
        setMedName('');
        setTime(new Date());
        setEditingReminderId(null);
    };

    async function schedulePushNotification({ medName, time }) {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Medicine Reminder",
                body: `Time to take your medicine: ${name}`,
            },
            trigger: { seconds: (time.getTime() - Date.now()) / 1000 },
        });
    }

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
            }
        })();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back-outline" size={24} onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Med Reminder</Text>
            </View>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                <Image source={{ uri: image }} style={styles.imagePreview} />
                ) : (
                <Text style={styles.imagePickerText}>Tap to select an image</Text>
                )}
            </TouchableOpacity>
            <TouchableOpacity  style={styles.addButton}>
                <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setModalVisible(true); resetForm(); }} style={styles.addButton}>
                <Text style={{ color: 'black', fontSize: 18, fontWeight: 'bold' }}>Add New Prescription</Text>
            </TouchableOpacity>
            <View style={{marginTop:20,}}></View>
            {reminders.map((reminder, index) => (
                <View key={index} style={styles.reminderBox}>
                    <Text style={{fontSize:20,fontWeight:'bold',marginTop:3}}>{reminder.name}</Text>
                    <Text style={{fontSize:20, marginLeft:50,marginTop:3}}>{reminder.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            setEditingReminderId(reminder.id);
                            setMedName(reminder.name);
                            setTime(new Date(reminder.time));
                            setModalVisible(true);
                        }}
                        style={styles.editButton}>
                        <Text>Edit</Text>
                    </TouchableOpacity>
                </View>
            ))}
            <Modal visible={modalVisible} animationType="slide" transparent={true}>
                <View style={styles.centeredModal}>
                    <View style={styles.modalContent}>
                    <Pressable onPress={() => setShowPicker(true)} style={styles.timeBox}>
            <Text>{formattedTime ? formattedTime : "Select Time"}</Text>
            </Pressable>

            {showPicker && (
            <DateTimePicker
                value={time}
                mode="time"
                is24Hour={true}
                display="default"
                onChange={(event, selectedTime) => {
                setShowPicker(false); // Hide the picker
                if (selectedTime) {
                    setTime(selectedTime); // Update time only if a time was selected
                }
                }}
            />
            )}

                        <TextInput
                            placeholder="Medicine Name"
                            value={medName}
                            onChangeText={setMedName}
                            style={styles.textInput}
                        />
                        <Pressable onPress={handleAddOrEditReminder} style={styles.submitButton}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Submit</Text>
                        </Pressable>
                        <Pressable onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>Cancel</Text>
                        </Pressable>

                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '90%',
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: {
        fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 30,
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: '#303030',
        borderRadius: 10,
        padding: 20,
        width: '90%',
        height: 200,
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
    },
    imagePickerText: {
        color: '#303030',
    },
    imagePreview: {
        width: '100%',
        height: '100%',
    },
    addButton: {
        marginVertical: 10,
        backgroundColor: '#add8e6',
        padding: 10,
        borderRadius: 5,
        alignSelf: 'center',
        width:'80%',
        alignItems:'center',
    },
    centeredModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalContent: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 50,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        padding: 10,
        marginBottom: 0,
        paddingVertical: 15,
        paddingHorizontal: 50,
    },
    submitButton: {
        backgroundColor: '#007BFF', // A shade of blue
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        minWidth: '80%', // Ensure button is wide for easy tapping
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
      },
      cancelButton: {
        backgroundColor: '#606060', // A shade of dark gray
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 8,
        marginTop: 10,
        minWidth: '80%', // Match the width of the submit button
        alignItems: 'center', // Center text horizontally
        justifyContent: 'center', // Center text vertically
        marginBottom: 20, // Add some space at the bottom
      },
    editButton: {
        marginTop: 0,
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginLeft:40,
    },
    reminderBox: {
        backgroundColor: '#e0ffff',
        padding: 15,
        borderRadius: 10,
        width: '90%',
        alignSelf: 'center',
        marginBottom: 10,
        flexDirection: 'row', // Arrange items in a row
        justifyContent: 'space-between', // Distribute space between items
        alignItems: 'center', // Align items vertically in the center
    },
    timeBox: {
        borderWidth: 1,
        borderColor: '#ccc',
        width: '100%',
        padding: 10,
        marginBottom: 20,
        paddingVertical: 15,
        paddingHorizontal: 70,
      },
});

export default MedReminderScreen;
