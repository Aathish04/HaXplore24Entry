import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Modal, Button } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import translations from "../cached_data/translated_texts_camera.json";
import { databases } from './Login';
import {ID} from 'appwrite'

const { width } = Dimensions.get('window');

const DATABASE_ID = "66071664001e1106b8bc"
const Hospital_CollectionID = "6608044500387ef00454"
const UserInformation_CollectionID = "66079e7c000cd257b449" 
const Doctor_CollectionID = "660804510032437783a5" 
const ENDPOINT = "https://frank-dinosaur-virtually.ngrok-free.app/v1"
const PROJECT = "6606f3f6002f1aec6db8"
const HEALTHMETRICS_COLLECTIONID = "660a081c001556633f60"


export default function VideoRecorder({language}) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState();
  const [file, setFile] = useState();
  const [ext, setExt] = useState();
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.torch);
  const [loading, setLoading] = useState(false); // State for loading indicator
  const [responseModalVisible, setResponseModalVisible] = useState(false); // State for response modal
  const [responseMessage, setResponseMessage] = useState(''); // State for response message


  const [hr, setHR] = useState(0);
  const [br, setBR] = useState(0);
  const [gl, setGL] = useState(0);
  const [phone, setPhone] = useState('');


  let cameraRef = null;
  
  const route = useRoute()
  const { params, path, name } = route;

  const DATABASE_ID = "66071664001e1106b8bc"
  const record_CollectionID = "660a081c001556633f60" 

  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus === 'granted');
    })();
  }, []);


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
       
      //  return key.toUpperCase();
  }

  async function sendRequest() {
    try {
      setLoading(true); // Set loading to true while awaiting response
      const url = 'https://commonly-liberal-porpoise.ngrok-free.app/gethr';
      const requestBody = {
        userid: params['$id'],
        ext: ext,
        data: file
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      setBR();
      setHR();
      setGL(responseData.glucose_level);
      setPhone(String(params.$id))

      let vitals = processText('Heart Rate') +' : ' + responseData.bpm +'\n'+ processText('Breathing Rate') +' : '+ responseData.breathingrate +'\n' + processText('Glucose Level') + ' : ' + 78.89
      setResponseMessage(vitals); // Set response message
      setResponseModalVisible(true); // Show response modal

      const currentTimeStamp = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true };
    const formattedDateTime = currentTimeStamp.toLocaleString('en-US', options);
      

      const data = 
      {
        'Phone' : phone,
        'GlucoseLevel' : parseFloat(78.89),
        'HeartRate' : parseFloat(responseData.bpm),
        'BreathingRate' : parseFloat(responseData.breathingrate),
        'TimeStamp' : formattedDateTime
      }


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


    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false); // Set loading to false after response or error
    }
  }

  function getFileExtension(uri) {
    const filename = uri.split('/').pop();
    const fileExtension = filename.split('.').pop();
    return fileExtension.toLowerCase();
  }

  const startRecording = async () => {
    if (cameraRef && hasCameraPermission && hasAudioPermission) {
      try {
        setRecording(true);
        const { uri } = await cameraRef.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 20,
          mute: true,
          
        });
        
        if (uri) {
          
          const fileExtension = getFileExtension(uri);
          setExt(fileExtension);
          await convertMP4ToBinary(uri);
        } else {
          console.warn('Invalid URI received');
        }
      } catch (error) {
        console.error('Error recording video:', error.message);
      }
    } else {
      console.warn('Permissions not granted for camera and audio recording');
    }
  };

  const stopRecording = async () => {
    if (cameraRef) {
      cameraRef.stopRecording();
    }
    setRecording(false);
  };

  async function convertMP4ToBinary(fileUri) {
    try {
      const fileInfo = await FileSystem.getInfoAsync(fileUri);
      const { exists, uri } = fileInfo;

      if (!exists) {
        throw new Error('File does not exist');
      }

      const binaryString = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64
      });
      setFile(binaryString);
    } catch (error) {
      console.error('Error converting MP4 to Binary:', error);
      throw error;
    }
  }

  return (
    <View style={{ flex: 1 }}>
      {loading ? ( // Show loading indicator if loading is true
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="blue" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 2, margin: 40, marginBottom: 100 }}>
            {videoUri ? (
              <Video
                source={{ uri: videoUri }}
                style={{ flex: 1 }}
                useNativeControls
                resizeMode="contain"
              />
            ) : (
              <Camera
                style={{ flex: 1 }}
                type={type}
                flashMode={flashMode}
                ref={(ref) => { cameraRef = ref; }}
              >
                <View
                  style={{
                    flex: 1,
                    backgroundColor: 'transparent',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                  }}
                >
                  {/* You can add additional components here if needed */}
                </View>
              </Camera>
            )}
          </View>
          <View style={{ alignItems: 'center', paddingBottom: 200 }}>
            <TouchableOpacity
              onPress={recording ? stopRecording : startRecording}
              style={[styles.button, { backgroundColor: recording ? 'red' : 'green' }]}
            >
              <Text style={styles.buttonText}>{recording ? processText('Stop Recording') : processText('Start Recording')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={sendRequest}
              style={[styles.button, { backgroundColor: 'blue', marginTop: 20 }]}
            >
              <Text style={styles.buttonText}>{processText("Click here to check vitals")}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      {/* Response Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={responseModalVisible}
        onRequestClose={() => setResponseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{responseMessage}</Text>
            <Button title="Close" onPress={() => setResponseModalVisible(false)} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: width * 0.6, // Adjust the width as needed
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff', // Button background color
    borderRadius: 25, // Half of the button height for rounded corners
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});

