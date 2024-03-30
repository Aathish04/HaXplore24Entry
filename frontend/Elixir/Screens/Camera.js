import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import { Video } from 'expo-av';
import * as FileSystem from 'expo-file-system';

export default function VideoRecorder() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasAudioPermission, setHasAudioPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [recording, setRecording] = useState(false);
  const [videoUri, setVideoUri] = useState();
  const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.torch);
  let cameraRef = null;
    let uri_ = ""
  useEffect(() => {
    (async () => {
      const { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus === 'granted');

      const { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      setHasAudioPermission(audioStatus === 'granted');
    })();
  }, []);

  const startRecording = async () => {
    if (cameraRef && hasCameraPermission && hasAudioPermission) {
      try {
        setRecording(true);
        const { uri } = await cameraRef.recordAsync({
          quality: Camera.Constants.VideoQuality['720p'],
          maxDuration: 20, // Maximum duration of the recording, in seconds
          mute: true, // Record audio along with video
        });
        setVideoUri(uri);
        bin = await convertMP4ToBinary(uri)
        console.log(bin)
    
      } catch (error) {
        console.error('Error recording video:', error.message);
      }
    } else {
      console.warn('Permissions not granted for camera and audio recording');
    }
  };

  const stopRecording = () => {
    setRecording(false);
    if (cameraRef) {
      cameraRef.stopRecording();
    }
  
    
  };

  if (hasCameraPermission === null || hasAudioPermission === null) {
    return <View />;
  }
  if (hasCameraPermission === false || hasAudioPermission === false) {
    return <Text>No access to camera and microphone</Text>;
  }



async function convertMP4ToBinary(fileUri) {
  try {
    // Read the file as a binary string
    const fileInfo = await FileSystem.getInfoAsync(fileUri);
    const { exists, uri } = fileInfo;

    if (!exists) {
      throw new Error('File does not exist');
    }

    const binaryString = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.UTF8
    });
    print(binaryString)
    return binaryString;
  } catch (error) {
    console.error('Error converting MP4 to Binary:', error);
    throw error;
  }
}

  return (
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
            flashMode={flashMode} // Set flash mode
            ref={(ref) => {
              cameraRef = ref;
            }}>
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}>
              {/* You can add additional components here if needed */}
            </View>
          </Camera>
        )}
      </View>
      <View style={{ alignItems: 'center', paddingBottom: 200 }}>
        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.button}>
          <Text style={styles.buttonText}>{recording ? 'Stop' : 'Start'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
