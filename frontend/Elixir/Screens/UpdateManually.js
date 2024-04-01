import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import translations from "../cached_data/translated_texts_updatemanually.json";
import { databases } from './Login';
import {ID} from 'appwrite'
import { useRoute } from '@react-navigation/native';



const DATABASE_ID = "66071664001e1106b8bc"
const Hospital_CollectionID = "6608044500387ef00454"
const UserInformation_CollectionID = "66079e7c000cd257b449" 
const Doctor_CollectionID = "660804510032437783a5" 
const ENDPOINT = "https://frank-dinosaur-virtually.ngrok-free.app/v1"
const PROJECT = "6606f3f6002f1aec6db8"
const HEALTHMETRICS_COLLECTIONID = "660a081c001556633f60"

const UpdateManually = ({language}) => {
  // State for input values
  const [hr, setHR] = useState();
  const [br, setBR] = useState();
  const [gl, setGL] = useState();
  const [bp, setBP] = useState();

  const route = useRoute()
  const { params, path, name } = route;
 
  

  const onSubmit = () => {
    const currentTimeStamp = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedDateTime = currentTimeStamp.toLocaleString('en-US', options);

    const data = {
      'Phone': String(params['$id']),
      'GlucoseLevel': parseFloat(gl),
      'BreathingRate': parseFloat(br),
      'HeartRate': parseFloat(hr),
      'TimeStamp': formattedDateTime
    };




    console.log(data);
    try{
        const t = databases.createDocument(DATABASE_ID, HEALTHMETRICS_COLLECTIONID, ID.unique(), JSON.stringify(data));
        console.log('Success!')
        console.log(t)
    

}
catch(e)
{
    console.log(e)
}



    // Here you can perform further actions with the form data, like sending it to a server
  };


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
         
         return key.toUpperCase();
    }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{processText("Update Your Information")}</Text>
      {/* <TextInput
        value={bp}
        onChangeText={setBP} // Use onChangeText to update the blood pressure state
        keyboardType="numeric"
        style={styles.input}
        placeholder={processText("Enter your Blood Pressure")}
      /> */}
      <TextInput
        value={gl}
        onChangeText={setGL} // Use onChangeText to update the glucose level state
        keyboardType="numeric"
        style={styles.input}
        placeholder={processText("Enter your Glucose Level")}
      />
      <TextInput
        value={br}
        onChangeText={setBR} // Use onChangeText to update the breathing rate state
        keyboardType="numeric"
        style={styles.input}
        placeholder={processText("Enter your Breathing Rate")}
      />
      <TextInput
        value={hr}
        onChangeText={setHR} // Use onChangeText to update the heart rate state
        keyboardType="numeric"
        style={styles.input}
        placeholder={processText("Enter your Heart Rate")}
      />
      <Button color="green" title={processText("Submit")} onPress={onSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'black',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 20,
    width: '100%',
    backgroundColor: '#f5f5f5',
    fontSize: 20,
  },
});

export default UpdateManually;
