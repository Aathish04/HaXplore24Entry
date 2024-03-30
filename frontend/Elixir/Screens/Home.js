import React, { useEffect, useState,useRef} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Pressable, Animated, PanResponder, Modal, Button} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import processText from '../utils/processText';
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
      if (gestureState.dx > 220) { // If slid to the end
        setSosActivated(true);
        setModalVisible(true); // Show confirmation modal
        Animated.timing(slideX, {
          toValue: 220,
          duration: 200,
          useNativeDriver: true,
        }).start();
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

//   const processText = (text) => {
//     // Example processing: convert text to uppercase

//     return text.toUpperCase()
// };

  return (
    <SafeAreaView style={styles.container}>
      <AntDesign style={styles.settings} name="setting" size={35} color="black" onPress={()=>{navigation.navigate('Settings')}} />
      <View style={styles.profileContainer}>
      <Text style={styles.profileName}>{processText("Welcome Grammie!")}👋</Text>
    
      </View>
      <View style={styles.buttonContainer}>
        {/* Medical Records Button */}
        <TouchableOpacity 
          style={[styles.individualButton, {borderColor: 'blue'}]} 
          onPress={() => {navigation.navigate('MedicalRecords')}}
        >
          <Ionicons name="document-text-outline" size={40} color="blue" />
          <Text style={styles.buttonText}>{processText("Medical Records")}</Text>
        </TouchableOpacity>

        {/* Hospital Visit Button */}
        <TouchableOpacity 
          style={[styles.individualButton, {borderColor: 'green'}]} 
          onPress={() => console.log('Hospital Visit')}
        >
          <FontAwesome name="hospital-o" size={40} color="green" />
          <Text style={styles.buttonText}>{processText("Doctor Visit")}</Text>
        </TouchableOpacity>

        {/* Medicine Reminder Button */}
        <TouchableOpacity 
          style={[styles.individualButton, {borderColor: 'orange'}]} 
          onPress={() => {navigation.navigate('MedReminder')}}
        >
          <Ionicons name="timer-outline" size={40} color="orange" />
          <Text style={styles.buttonText}>{processText("Tele consult")}</Text>
        </TouchableOpacity>

        {/* Check Up Button */}
        <TouchableOpacity 
          style={[styles.individualButton, {borderColor: 'red'}]} 
          onPress={() => navigation.navigate('UpdateVitals')}
        >
          <Ionicons name="heart-outline" size={40} color="red" />
          <Text style={styles.buttonText}>{processText("Update Vitals")}</Text>
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
            <Text style={styles.modalText}>SOS Activated!</Text>
            <Button title="Cancel SOS" onPress={handleCancelSOS} />
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
        <Text style={{marginLeft:90}}>Slide this button to activate --{'>'}</Text>
      </View>
    </SafeAreaView>
  );
};



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
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginTop: 0,
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

export default AppPage;
