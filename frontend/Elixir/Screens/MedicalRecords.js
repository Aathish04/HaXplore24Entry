import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

const MedicalRecordsPage = ({ navigation }) => {
  const [fileUri, setFileUri] = useState(null);
  const [filename, setFilename] = useState(null);
  const [link, setLink] = useState('');

  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Specify the MIME types of files you want to pick
      });
      if (result.canceled == false) {
        setFileUri(result.assets[0].uri);
        setFilename(result.assets[0].name);
      }
    } catch (err) {
      console.error('Error picking PDF file:', err);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });
      if (!result.cancelled) {
        setFileUri(result.assets[0].uri);
        setFilename(result.assets[0].fileName);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleSubmit = () => {
    const fakeLink = 'https://example.com/medical-record.pdf'; // Example link
    setLink(fakeLink);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>Upload Medical Records</Text>
      </View>
    
      <TouchableOpacity style={styles.filePicker} onPress={pickPDF}>
        <Text style={styles.filePickerText}>Select PDF</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
        <Text style={styles.filePickerText}>Select Image</Text>
      </TouchableOpacity>
      {fileUri && (
        <View style={styles.previewContainer}>
          <Text style={styles.previewText}>Selected File:</Text>
          {fileUri.endsWith('.pdf') ? (
            <Text style={styles.fileUri}>{filename}</Text>
          ) : (
            <Image source={{ uri: fileUri }} style={styles.previewImage} />
          )}
        </View>
      )}
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
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 30,
  },
  filePicker: {
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filePickerText: {
    color: '#303030',
    fontSize: 20,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    elevation: 2,
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  previewContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  previewText: {
    fontSize: 18,
    color: '#303030',
    marginBottom: 10,
  },
  fileUri: {
    color: '#008080',
    fontSize: 16,
  },
  previewImage: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  linkContainer: {
    marginTop: 20,
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
