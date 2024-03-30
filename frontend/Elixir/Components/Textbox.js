import React from "react";
import { TextInput } from "react-native";

function Textbox({ value, onChange, placeholder }) {
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
      onChangeText={(e) => {
        onChange(e);
      }}
    />
  );
}

export default Textbox;