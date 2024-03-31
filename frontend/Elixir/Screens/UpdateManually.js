import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import processText from '../utils/processText';
const UpdateManually = () => {
  // State for input values
  const [hr, setHR] = useState();
  const [br, setBR] = useState();
  const [gl, setGL] = useState();
  const [bp, setBP] = useState();

  const onSubmit = () => {
    const data = {
      bloodPressure: parseInt(bp),
      glucoseLevel: parseInt(gl),
      breathingRate: parseInt(br),
      heartRate: parseInt(hr),
    };
    console.log(data);
    // Here you can perform further actions with the form data, like sending it to a server
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{processText("Update Your Information")}</Text>
      <TextInput
        value={bp}
        onChangeText={setBP} // Use onChangeText to update the blood pressure state
        keyboardType="numeric"
        style={styles.input}
        placeholder={processText("Enter your Blood Pressure")}
      />
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
