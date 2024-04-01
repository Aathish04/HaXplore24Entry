import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, TouchableOpacity, Image, Modal, FlatList } from 'react-native';
import Textbox from "../Components/Textbox";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from '@expo/vector-icons';
import MyPassword from "../Components/Password";
import translations from "../cached_data/translated_texts_login.json";

import * as WebBrowser from 'expo-web-browser';
import { Client, Account, Databases } from "appwrite";
import { useRoute } from "@react-navigation/native"

const DATABASE_ID = "66071664001e1106b8bc"
const Hospital_CollectionID = "6608044500387ef00454"
const UserInformation_CollectionID = "66079e7c000cd257b449"
const Doctor_CollectionID = "660804510032437783a5"
const ENDPOINT = "https://frank-dinosaur-virtually.ngrok-free.app/v1"
const PROJECT = "6606f3f6002f1aec6db8"

const client = new Client();
export const account = new Account(client);
export const databases = new Databases(client);

const languageList = {
    "English": "en",
    "Assamese": "as",
    "Bengali": "bn",
    "Bodo": "brx",
    "Dogri": "doi",
    "Konkani": "gom",
    "Gujarati": "gu",
    "Hindi": "hi",
    "Kannada": "kn",
    "Kashmiri": "ks",
    "Kashmiri (Devanagari script)": "ks_Deva",
    "Maithili": "mai",
    "Malayalam": "ml",
    "Manipuri": "mni",
    "Manipuri (Bengali script)": "mni_Beng",
    "Marathi": "mr",
    "Nepali": "ne",
    "Odia": "or",
    "Punjabi": "pa",
    "Sanskrit": "sa",
    "Santali": "sat",
    "Sindhi": "sd",
    "Sindhi (Devanagari script)": "sd_Deva",
    "Tamil": "ta",
    "Telugu": "te",
    "Urdu": "ur"
};

export default function Login({setLanguage, language}) {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [userID, setUserID] = useState('');
    // const [language, setLanguage] = useState('ta');
    const [usesession, setSession] = useState('');
    const [showLanguageModal, setShowLanguageModal] = useState(false);

    client.setEndpoint(ENDPOINT).setProject(PROJECT) // Your project ID

    function processText(key) {
        if (translations[key][language]) {
            // Return the translation for the specified language
            return translations[key][language];
        } else {
            // If the specified language doesn't exist, fallback to English
            return translations[key]['en'];
        }
    }

    const LanguageButton = () => (
        <Pressable
            style={styles.languageButton}
            onPress={() => setShowLanguageModal(true)}
        >
            <Text style={styles.buttonText}>{language}</Text>
        </Pressable>
    );

    const LanguageModal = () => (
        <Modal
            animationType="slide"
            transparent={true}
            visible={showLanguageModal}
            onRequestClose={() => setShowLanguageModal(false)}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                    <FlatList
                        data={Object.keys(languageList)}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={styles.languageItem}
                                onPress={() => {
                                    setLanguage(languageList[item]);
                            
                                    setShowLanguageModal(false);
                                    console.log(language)
                                }}
                            >
                                <Text>{item}</Text>
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item}
                    />
                </View>
            </View>
        </Modal>
    );

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <LanguageButton />
                <LanguageModal />
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/icon.png')}
                        style={styles.logo}
                    />
                </View>
                <View style={styles.inputContainer}>

                    <Textbox
                        value={email}
                        placeholder={processText("Enter Email ID")}
                        onChange={setEmail}
                    />
                    <MyPassword
                        value={password}
                        placeholder={processText("Enter Password")}
                        onChange={setPassword}
                    />
                </View>
                <Pressable
                    style={styles.button}
                    onPress={async () => {

                        try {
                            const response = await account.createEmailPasswordSession(email, password);
                            console.log("LOGIN SUCCESS!! USER SESSION", response);
                            setUserID(response.userId);
                            setSession(response.$id);

                            const dbResponse = await databases.getDocument(DATABASE_ID, UserInformation_CollectionID, response.userId);
                            // const dbResponse = await databases.listDocuments(DATABASE_ID,UserInformation_CollectionID)
                            console.log("DATABASE SUCCESS!!", JSON.stringify(dbResponse));
                            // setDatabaseData(dbResponse);

                            navigation.navigate('Home', dbResponse, userID, language);

                        } catch (error) {
                           // console.error('Error during login:', error);
                            console.log("Deleting Session");
                            await account.deleteSessions();
                        }
                    }


                    }>
                    <Text style={styles.buttonText}> {processText("Login")}</Text>
                </Pressable>
                <Pressable
                    style={styles.button}
                    onPress={async () => {
                        try {
                            const headers = {
                                'Content-Type': 'application/json',
                                'ngrok-skip-browser-warning': true
                            };

                            const response = await fetch("https://commonly-liberal-porpoise.ngrok-free.app/init_digilocker_flow", {
                                method: 'GET',
                                headers: headers
                            });

                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }

                            const data = await response.json();
                            console.log(data);

                            if (data.url) {
                                await WebBrowser.openBrowserAsync(data.url);
                            }
                        } catch (error) {
                            console.error('There was a problem with your fetch operation:', error);
                        }
                    }}
                >
                    <Text style={styles.buttonText}> {processText("Register")}</Text>
                </Pressable>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    scrollView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "white",
        paddingVertical: 100,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    logo: {
        height: 56,
        width: 250,
        marginTop: 110,
        tintColor: 'rgba(0, 0, 0, 1)'
    },
    inputContainer: {
        width: 360,
        marginBottom: 50,
    },
    button: {
        backgroundColor: '#112A46',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        height: 50,
        marginBottom: 30
    },
    languageButton: {
        backgroundColor: '#112A46',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        height: 50,
        marginBottom: 10
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
    },
    languageItem: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});
