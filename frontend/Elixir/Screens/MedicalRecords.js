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
  const [recordType, setRecordType] = useState('Prescription'); // Default to Prescription

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

  function processText(key,language='ta')
  {
      return key.toUpperCase();  
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{processText("Upload Medical Records")}</Text>
      </View>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, recordType === 'Prescription' && styles.selectedRadioButton]}
          onPress={() => setRecordType('Prescription')}
        >
          <Text style={styles.radioText}>{processText("Prescription")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, recordType === 'Report' && styles.selectedRadioButton]}
          onPress={() => setRecordType('Report')}
        >
          <Text style={styles.radioText}>{processText("Report")}</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.filePicker} onPress={pickPDF}>
        <Text style={styles.filePickerText}>{processText("Select PDF")} </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filePicker} onPress={pickImage}>
        <Text style={styles.filePickerText}>{processText("Select Image")}</Text>
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
        <Text style={styles.submitButtonText}>{processText("Submit")}  </Text>
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
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 30,
  },
  radioContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  radioButton: {
    borderWidth: 1,
    borderColor: '#303030',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  selectedRadioButton: {
    backgroundColor: 'yellow',
  },
  radioText: {
    color: '#303030',
    fontSize: 20,
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
    marginLeft: 40,
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
    alignSelf: 'center',
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
    marginLeft: 50,
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
