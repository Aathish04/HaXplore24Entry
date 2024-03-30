import { View, Text, StyleSheet, SafeAreaView, ScrollView, Pressable, TouchableOpacity} from "react-native";
import Textbox from "../Components/Textbox";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import MyPassword from "../Components/Password";
import login_cache from "../cached_data/translated_texts_login.json"

export default function Login()
{
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [language, setLanguage] = useState('hi');
    
    
    const processText = (text) => {
        // Example processing: convert text to uppercase

        return login_cache[text][language];
    };

    return(
        <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
        <ScrollView contentContainerStyle={styles.scrollView}>
            <View style={styles.container}>
                {/* <Image source={require('../assets/logo.png')} style={styles.image} /> */}
                <View style={styles.inputContainer}>
                    <Textbox
                        value={email}
                        placeholder={processText("Email")}
                        onChange={setEmail}
                    />
                    <MyPassword
                        
                        value={password}
                        placeholder={processText("Password")}
                        onChange={setPassword}
                        
                    />
                </View>
                <Pressable 
                    style={styles.button}
                    onPress={ () => {navigation.navigate("Home")}}>
                    <Text style={styles.buttonText}> {processText("Login")}</Text>
                </Pressable>
                <Text style={{ color: '#112A46' }}>  {processText("Don't have an account?")} </Text>
                <TouchableOpacity onPress={() => { navigation.navigate('SignUp') }}>
                    <Text style={styles.signup}>{processText("SignUp")}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    scrollView: {
        padding:100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:"white",

    },
    image: {
        height: 140,
        aspectRatio: 1.9,
        marginBottom: 30,
        tintColor: 'rgba(0, 0, 0, 0.7)',
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        width:'100%',
        marginTop:50,
    },
    button: {
        backgroundColor: '#112A46',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 5,
        height: 50,
        marginBottom: 30
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    inputContainer: {
        marginTop:20,
        width: 360,
        marginBottom: 50, // Removed duplicated marginBottom property

    },
    signup: {
        color: '#112A46',
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        paddingBottom: 40,
    }
});