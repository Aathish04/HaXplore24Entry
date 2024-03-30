import React from "react";
import { TextInput } from "react-native";

function MyPassword({ value, onChange, placeholder }) {
  return (
    <TextInput
      style={{
        borderWidth: 1.5,
        borderColor: "black",
        borderRadius: 10,
        padding: 10,
        margin: 15,
        color: "black",
        backgroundColor: 'white' // Set text color to white
 
      }}
      value={value}
      placeholder={placeholder}
      secureTextEntry
      onChangeText={(e) => {
        onChange(e);
      }}
    />
  );
}

export default MyPassword;