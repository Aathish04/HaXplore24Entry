import React, { useState } from "react";
import { View, Image, StyleSheet, Pressable, Text, ScrollView, SafeAreaView, Modal, TouchableOpacity } from "react-native";
import Textbox from "../Components/Textbox";
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const languages = {
  'English': 'en', 'Assamese': 'as', 'Bangla': 'bn',
  'Boro': 'brx', 'Dogri': 'doi', 'Goan-Konkani': 'gom', 'Gujarati': 'gu',
  'Hindi': 'hi', 'Kannada': 'kn', 'Kashmiri (Arabic)': 'ks',
  'Kashmiri (Devanagari)': 'ks_Deva', 'Maithili': 'mai', 'Malayalam': 'ml',
  'Manipuri (Meitei)': 'mni', 'Manipuri (Bengali)': 'mni_Beng', 'Marathi': 'mr',
  'Nepali': 'ne', 'Odia': 'or', 'Panjabi': 'pa', 'Sanskrit': 'sa', 'Santali': 'sat',
  'Sindhi (Arabic)': 'sd', 'Sindhi (Devanagari)': 'sd_Deva', 'Tamil': 'ta', 'Telugu': 'te', 'Urdu': 'ur'
};

export default function SignUpScreen() {
  const [fullName, setfullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [location, setLocation] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigation = useNavigation();

  const cleanEmail = (email) => {
    return email.replace(/\s/g, ''); // Removes all white spaces from email
  };

  const selectLanguage = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setIsModalVisible(false);
  };

   
  const processText = (text) => {
    // Example processing: convert text to uppercase

    return text.toUpperCase();
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#8CA9AD" }}>
      <ScrollView>
        <View style={styles.container}>

          <View style={styles.backbutton}>
            <Pressable
              onPress={() => {
                navigation.navigate('Login')
              }}>
              <Ionicons name="arrow-back-outline" size={32} color="white" />
            </Pressable>
          </View>

          <View style={styles.inputContainer}>
            <Textbox
              value={fullName}
              onChange={setfullName}
              placeholder={processText("Fullname")}
              style={styles.input}
            />
            <Textbox
              value={age}
              onChange={setAge}
              placeholder={processText("Age")}
              style={styles.input}
            />
            <Textbox
              value={location}
              onChange={setLocation}
              placeholder={processText("Location")}
              style={styles.input}
            />
            <Pressable
              style={styles.languageInput}
              onPress={() => setIsModalVisible(true)}
            >
              <Text>{language ? language : processText("Select Language")}</Text>
            </Pressable>

            <Textbox
              value={email}
              onChange={setEmail}
              placeholder={processText("Email")}
              style={styles.input}
            />
            <Textbox
              value={password}
              onChange={setPassword}
              placeholder={processText("Password")}
              style={styles.input}
              secureTextEntry={true}
            />
          </View>
          <Pressable
            style={styles.button}
            onPress={() => { console.log('Hello') }}
          >
            <Text style={styles.buttonText}>{processText("SignUp")}</Text>
          </Pressable>

          <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setIsModalVisible(false)}

          >
            <View style={styles.modalContainer}>
              <ScrollView style={styles.modalContent}>
                {Object.keys(languages).map((lang, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.languageItem}
                    onPress={() => selectLanguage(lang)}
                  >
                    <Text>{lang}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </Modal>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center', // Center horizontally
    paddingBottom: 200,
    backgroundColor: 'white',
    padding: 20
  },
  inputContainer: {
    width: '100%',
    marginTop: -30,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
  },
  languageInput: {
    
    borderWidth: 1.5,
        borderColor: "black",
        borderRadius: 10,
        padding: 12,
        margin: 15,
        color: "black",
        backgroundColor: 'white'
  },
  button: {
    backgroundColor: '#112A46', // Button background color changed to white
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 25,
    height: 50,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  backbutton: {
    marginBottom: 70,
    marginLeft: -300,
    backgroundColor: '#112A46',
    borderRadius: 20,
    padding: 10,
    marginTop: 70,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    maxHeight: '80%',
  },
  languageItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
