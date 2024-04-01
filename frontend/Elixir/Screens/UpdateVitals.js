import React from 'react';
import { View, Button, TouchableOpacity, Text } from 'react-native'; // Import TouchableOpacity and Text
import { Ionicons, FontAwesome } from '@expo/vector-icons'; // Import Ionicons and FontAwesome icons
import { StyleSheet } from 'react-native';
import translations from "../cached_data/translated_texts_updatevitals.json";
import { useRoute } from '@react-navigation/native';

import { useNavigation } from "@react-navigation/native";
export default function UpdateVitals({ language }) {
    // Define functions for button click events
    

  const route = useRoute()
  const { params, path, name } = route;
  const navigation = useNavigation();


    function processText(key)
    {
        if (translations[key][language]) 
        {
            // Return the translation for the specified language
            return translations[key][language];
        
        } 
        else
           {
            // If the specified language doesn't exist, fallback to English
            return translations[key]['en'];
         }   
         
         
    }

    return (
        <View>
            <View style={styles.buttonContainer}>
                {/* Medical Records Button */}
                <TouchableOpacity 
                    style={[styles.individualButton, {borderColor: 'blue'}]} 
                    onPress={() => {navigation.navigate('Camera',params)}}
                >
                    <Ionicons name="document-text-outline" size={40} color="blue" />
                    <Text style={styles.buttonText}>{processText("Record Vitals")}</Text>
                </TouchableOpacity>

                {/* Hospital Visit Button */}
                <TouchableOpacity 
                    style={[styles.individualButton, {borderColor: 'green'}]} 
                    onPress={() => {navigation.navigate('UpdateManually', params)}}
                >
                    <FontAwesome name="hospital-o" size={40} color="green" />
                    <Text style={styles.buttonText}>{processText("Update Manually")}</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white', 
    },
    header: {
      marginLeft:320,
      marginTop:40,
      padding: 20,
    },
    settingsIcon: {
      color: 'black',
    },
    settings:{
      marginLeft:330,
      marginTop:50,
    },
    
    profileName: {
      fontSize: 25,
      color: 'black',
      fontWeight: 'bold',
      marginLeft:30,
      marginBottom:70,
      marginTop:30,
    },
   
    buttonContainer: {
      flexDirection: 'column',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
      marginTop: 0,
      alignContent: 'center',
      marginTop:250

    },
    individualButton: {
      backgroundColor: 'white',
      padding: 30,
      width: '42%',
      marginVertical: 10,
      borderRadius: 10,
      borderWidth: 3,
      alignItems: 'center',
    },
    buttonText: {
      color: 'black',
      fontSize: 20,
      fontWeight: '500',
      marginTop: 10,
    },
    buttonIcon: {
      color: 'black', // Icon color matching the background
      marginBottom: 20,
    },
  
    sliderContainer: {
      width: 300, // Width of the sliding path
      height: 80, // Height matches the slider button for a snug fit
      backgroundColor: '#E0E0E0', // A neutral color for the background
      borderRadius: 40, // Rounded corners
      justifyContent: 'center', // Center the slider button vertically
      alignContent:'center',
      overflow: 'hidden', // Keeps the slider button from overflowing visually
      marginLeft:45,
      marginTop:50,
    },
    slider: {
      width: 80,
      height: 80,
      position: 'absolute',
      left: 0, // Start from the left edge of the container
      borderRadius: 40,
      backgroundColor: '#FF0000', // Red for SOS
      alignItems: 'center',
      justifyContent: 'center',
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 22
    },
    modalView: {
      margin: 30,
      backgroundColor: "white",
      borderRadius: 20,
      borderWidth:2,
      padding: 50,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    modalText: {
      fontSize:35,
      marginBottom: 30,
      textAlign: "center"
    }
  });
  
  