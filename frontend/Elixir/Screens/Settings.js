import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Pressable, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const SettingsPage = ({ navigation }) => {
  const [textSize, setTextSize] = useState(20);
  const [voiceAssist, setVoiceAssist] = useState(false);
  const [language, setLanguage] = useState('English');
  const [showDropdown, setShowDropdown] = useState(false);
  const languages = ['English', 'Tamil', 'Hindi', 'Malayalam'];
  
  useEffect(()=>{
    console.log(textSize)
  })
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="arrow-back-outline" size={24} color="black" onPress={() => navigation.goBack()} />
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.content}>

        {/* Text Size Slider */}
        <View style={styles.settingItem}>
          <Text style={[styles.text, { fontSize: textSize }]}>Text Size: {textSize}</Text>
          <Slider
            style={styles.slider}
            minimumValue={10}
            maximumValue={30}
            step={1}
            value={textSize}
            onValueChange={setTextSize}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
          />
        </View>
        <View style={styles.divider} />
        {/* Voice Assist Switch */}
        <View style={styles.settingItem}>
          <View style={styles.voice}>
          <Text style={styles.text}>Voice Assist: {voiceAssist ? 'Yes' : 'No'}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={voiceAssist ? "#f5dd4b" : "#f4f3f4"}
            onValueChange={setVoiceAssist}
            value={voiceAssist}
          />
        </View>
        </View>
        <View style={styles.divider} />
        {/* Language Selection Dropdown */}
        <View style={styles.settingItem}>
          <Text style={styles.text}>Language: {language}</Text>
          <Pressable style={styles.pressableArea} onPress={() => setShowDropdown(!showDropdown)}>
            <Text style={styles.pressableText}>{language} - Tap to change</Text>
          </Pressable>
          {showDropdown && (
            <View style={styles.dropdown}>
              {languages.map((lang, index) => (
                <TouchableOpacity key={index} onPress={() => { setLanguage(lang); setShowDropdown(false); }}>
                  <Text style={styles.dropdownText}>{lang}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
        <View style={styles.divider} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignContent:'center',
        paddingTop: 50,
      },
      header: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        marginBottom: 100,
        marginLeft:20,
      },
      headerTitle: {
        fontSize: 25,
        color: 'black',
        fontWeight: 'bold',
        marginLeft: 30,
      },
  content: {
    alignItems: 'center',
    padding: 20,
  },
  settingItem: {
    width: '100%',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  voice:{
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    
  },
  slider: {
    width: '100%',
    marginTop: 20,
    height:'130',
  },
  text: {
    fontSize: 20,
  },
  pressableArea: {
    marginTop: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
  },
  switch:{
    width:120,
    transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }]
  },
  pressableText: {
    fontSize: 20,
    color: 'blue',
  },
  dropdown: {
    marginTop: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'white',
  },
  dropdownText: {
    padding: 10,
    fontSize: 20,
  },
  divider: {
    borderBottomColor: '#d3d3d3',
    borderBottomWidth: 1,
    width: '100%',
    alignSelf: 'center',
    marginVertical: 20,
  },
});

export default SettingsPage;
