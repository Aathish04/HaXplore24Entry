import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Pressable } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const MedicalRecordsPage = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [link, setLink] = useState('');

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

  const handleSubmit = () => {
    const fakeLink = 'https://example.com/medical-record.jpg';
    setLink(fakeLink);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Upload Medical Records</Text>
      </View>
    
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.imagePickerText}>Tap to select an image</Text>
        )}
      </TouchableOpacity>
      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </Pressable>
      {link !== '' && (
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>Record Link:</Text>
          <TextInput style={styles.link} value={link} editable={false} />
        </View>
      )}
    </View>
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
    marginBottom: 170,
    marginLeft:30,
  },
  headerText: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 30,
  },
  instructionText: {
    marginBottom: 10,
    color: '#303030',
    fontSize:25,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    height: 200,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft:40,
  },
  imagePickerText: {
    color: '#303030',
    fontSize:30,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 30,
    paddingHorizontal: 40,
    width:'80%',
    elevation: 2,
    marginLeft:40,
    alignItems:'center'
  },

  submitButtonText: {
    color: 'white',
    fontSize: 25,
    fontWeight: 'bold',
  },
  linkContainer: {
    marginTop: 20,
    marginLeft:50,
  },
  linkText: {
    fontSize: 18,
    color: '#303030',
  },
  link: {
    color: '#008080',
    fontSize: 16,
  },
});

export default MedicalRecordsPage;
