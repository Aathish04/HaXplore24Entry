import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Pressable, Animated, PanResponder, Modal, Button, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';

const AppPage = ({ navigation }) => {
  //Slide till sos
  const slideX = useRef(new Animated.Value(0)).current;
  const [sosActivated, setSosActivated] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event([null, { dx: slideX }], {
      useNativeDriver: false,
      listener: (event, gestureState) => {
        if (gestureState.dx < 0) {
          slideX.setValue(0); // Prevent sliding to the left
        }
      },
    }),
    onPanResponderRelease: (e, gestureState) => {
      if (gestureState.dx > 220) {
        // If slid to the end
        setSosActivated(true);
        setModalVisible(true); // Show confirmation modal
        Animated.timing(slideX, {
          toValue: 220,
          duration: 200,
          useNativeDriver: true,
        }).start();

        console.log(route.params);
      } else {
        // Slide back to start if not reached the end
        Animated.spring(slideX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const handleCancelSOS = () => {
    setModalVisible(false); // Hide modal
    setSosActivated(false); // Reset SOS activation
    // Reset slider position
    Animated.timing(slideX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  // Dummy action for button press
  const handlePress = (button) => {
    console.log(`${button} button pressed`);
  };
 
  const route = useRoute()
  const { params, path, name } = route;
  const photo = 'data:image/jpeg;base64,' + params.Photograph


  function processText(key,language='hi')
  {
      // if (translations[key][language]) 
      // {
      //     // Return the translation for the specified language
      //     return translations[key][language];
      // } 
      // else
      //    {
      //     // If the specified language doesn't exist, fallback to English
      //     return translations[key]['en'];
      //  }     
      
      return key.toUpperCase();
  }


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <AntDesign style={styles.settings} name="setting" size={35} color="black" onPress={() => { navigation.navigate('Settings') }} />
        <View style={styles.profileContainer}>
          <View style={styles.profileImageContainer}>
            {/* Display the base64 image */}
            <Image source={{ uri: photo }} style={styles.profileImage} />
            {/* Circular spot */}
            <View />
          </View>
          <Text style={styles.profileName}>{processText("Welcome, ")} {params.Name} 👋</Text>
        </View>
        <View style={styles.buttonContainer}>
          {/* Medical Records Button */}
          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'blue' }]}
            onPress={() => { navigation.navigate('MedicalRecords') }}
          >
            <Ionicons name="document-text-outline" size={40} color="blue" />
            <Text style={styles.buttonText}>{processText("Medical Records")}</Text>
          </TouchableOpacity>

          {/* Hospital Visit Button */}
          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'green' }]}
            onPress={() => console.log('Hospital Visit')}
          >
            <FontAwesome name="hospital-o" size={40} color="green" />
            <Text style={styles.buttonText}>{processText("Doctor Visit")}</Text>
          </TouchableOpacity>

          {/* Medicine Reminder Button */}
          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'orange' }]}
            onPress={() => { navigation.navigate('MedReminder') }}
          >
            <Ionicons name="timer-outline" size={40} color="orange" />
            <Text style={styles.buttonText}>{processText("Teleconsult")}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'orange' }]}
            onPress={() => { navigation.navigate('MedReminder') }}
          >
            <Ionicons name="timer-outline" size={40} color="orange" />
            <Text style={styles.buttonText}>{processText("Generate Reports")}</Text>
          </TouchableOpacity>


          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'orange' }]}
            onPress={() => { navigation.navigate('MedReminder') }}
          >
            <Ionicons name="timer-outline" size={40} color="orange" />
            <Text style={styles.buttonText}>Dummy</Text>
          </TouchableOpacity>

          {/* Check Up Button */}
          <TouchableOpacity
            style={[styles.individualButton, { borderColor: 'red' }]}
            onPress={() => navigation.navigate('UpdateVitals')}
          >
            <Ionicons name="heart-outline" size={40} color="red" />
            <Text style={styles.buttonText}>{processText("Measure Vitals")}</Text>
          </TouchableOpacity>
        </View>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>SOS {processText("Activated!")}</Text>
              <Button title={processText("Cancel SOS")} onPress={handleCancelSOS} />
            </View>
          </View>
        </Modal>
        <View style={styles.sliderContainer}>
          <Animated.View
            style={[styles.slider, { transform: [{ translateX: slideX }] }]}
            {...panResponder.panHandlers}
          >
            <MaterialIcons name="sos" size={40} color="black" />
          </Animated.View>
          <Text style={{ marginLeft: 90 }}>{processText("Slide this button to activate")}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 70,
    paddingLeft: 20
  },
  profileContainer: {
    alignItems: 'center',
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  
  profileName: {
    fontSize: 25,
    color: 'black',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 10,
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
  sliderContainer: {
    width: 300,
    height: 80,
    backgroundColor: '#E0E0E0',
    borderRadius: 40,
    justifyContent: 'center',
    alignContent: 'center',
    overflow: 'hidden',
    marginLeft: 45,
    marginTop: 50,
  },
  slider: {
    width: 80,
    height: 80,
    position: 'absolute',
    left: 0,
    borderRadius: 40,
    backgroundColor: '#FF0000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 30,
    backgroundColor: "white",
    borderRadius: 20,
    borderWidth: 2,
    padding: 50,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 35,
    marginBottom: 30,
    textAlign: "center",
  },
});

export default AppPage;
