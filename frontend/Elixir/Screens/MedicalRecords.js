import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Pressable, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useRoute } from '@react-navigation/native';
import translations from "../cached_data/translated_texts_medicalrecords.json";
import { useNavigation } from "@react-navigation/native";

const MedicalRecordsPage = ({ language }) => {
  const [fileUri, setFileUri] = useState(null);
  const [filename, setFilename] = useState(null);
  const [filetype, setFiletype] = useState(null);
  const [file, setFile] = useState(null);
  const [link, setLink] = useState('');
  const [recordType, setRecordType] = useState('prescription'); // Default to Prescription

  function getFileExtension(uri) {
    // Extract the filename from the URI
    const filename = uri.split('/').pop();
  
    // Extract the file extension from the filename
    const fileExtension = filename.split('.').pop();
  
    return fileExtension.toLowerCase(); // Return the lowercase file extension
  }

  const navigation = useNavigation()



  const pickPDF = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Specify the MIME types of files you want to pick
      });
      if (result.canceled == false) {
        setFileUri(result.assets[0].uri);
        setFilename(result.assets[0].name);
        setFiletype("pdf")
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
        console.log(result.assets[0].uri);
        setFileUri(result.assets[0].uri);
        setFilename(result.assets[0].fileName);
        setFiletype(getFileExtension(fileUri))
        console.log(filetype);
      }
    } catch (err) {
      console.error('Error picking image:', err);
    }
  };

  const handleSubmit = () => {
    const fakeLink = 'https://example.com/medical-record.pdf'; // Example link
    setLink(fakeLink);
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
    
  }

  const route = useRoute()
  const { params, path, name } = route;
 
  

  async function sendRequest()
  {
    try {
      const url = 'https://commonly-liberal-porpoise.ngrok-free.app/perform_ocr'; // Replace 'https://api.example.com/post' with your actual endpoint URL
    
      // Data to be sent in the request body
      const file = await uriToBinary(fileUri);
      setFile(file);

      const requestBody = {
        user_id: params['$id'],
        record_type: recordType,
        type: filetype,
        binary: file

        // Add more key-value pairs as needed
      };
      // console.log(requestBody)
      const response = await fetch(url, {
        method: 'POST', // Specify the HTTP method
        headers: {
          'Content-Type': 'application/json', // Specify the content type (JSON in this case)
          // Add more headers if required
        },
        body: JSON.stringify(requestBody), // Convert the request body to JSON format
      });
    
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    
      const responseData = await response.json(); // Parse the response JSON
    
      // Handle the response data
      console.log('Response data:', responseData);
    } catch (error) {
      console.error('Error:', error.message);
    }
    
  }



async function uriToBinary(localUri) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri); // Get file information
    if (!fileInfo.exists) {
      throw new Error('File does not exist');
    }

    const { uri } = fileInfo;
    const binaryData = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64, // Read file as Base64 encoded string
    });

    return binaryData;
  } catch (error) {
    console.error('Error converting URI to binary:', error);
    return null;
  }
}


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerText}>{processText("Upload Medical Records")}</Text>
      </View>
      <View style={styles.radioContainer}>
        <TouchableOpacity
          style={[styles.radioButton, recordType === 'prescription' && styles.selectedRadioButton]}
          onPress={() => setRecordType('prescription')}
        >
          <Text style={styles.radioText}>{processText("Prescription")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.radioButton, recordType === 'report' && styles.selectedRadioButton]}
          onPress={() => setRecordType('report')}
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
      <Pressable style={styles.submitButton} onPress={sendRequest}>
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
