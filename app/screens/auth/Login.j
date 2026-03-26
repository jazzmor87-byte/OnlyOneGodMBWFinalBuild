import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../supabase';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert("Missing fields", "Please enter email and password.");
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Login failed", error.message);
    } else {
      navigation.navigate("UserHome");
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'black', justifyContent: 'center', padding: 30 }}>
      <Text style={{ fontSize: 26, color: 'gold', marginBottom: 20 }}>
        Login
      </Text>

      <TextInput
        placeholder="Enter email"
        placeholderTextColor="#777"
        style={{ backgroundColor: '#111', color: 'white', padding: 15, borderRadius: 8, marginBottom: 20 }}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Enter password"
        placeholderTextColor="#777"
        secureTextEntry
        style={{ backgroundColor: '#111', color: 'white', padding: 15, borderRadius: 8, marginBottom: 20 }}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={{ backgroundColor: 'gold', padding: 15, borderRadius: 8 }}
        onPress={handleLogin}
      >
        <Text style={{ textAlign: 'center', color: 'black', fontSize: 20 }}>
          LOGIN
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
        <Text style={{ color: 'white', marginTop: 20, textAlign: 'center' }}>
          Create a new account
        </Text>
      </TouchableOpacity>
    </View>
  );
}