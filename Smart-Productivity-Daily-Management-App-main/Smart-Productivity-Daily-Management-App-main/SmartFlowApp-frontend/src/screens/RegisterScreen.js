import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    await AsyncStorage.setItem('token', 'demo-token-123');
    navigation.replace('Main');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F0F14', justifyContent: 'center', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 }}>Create Account</Text>
      <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#666" style={{ backgroundColor: '#1E1E26', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12 }} />
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#666" style={{ backgroundColor: '#1E1E26', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor="#666" style={{ backgroundColor: '#1E1E26', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 20 }} />
      <TouchableOpacity onPress={handleRegister} style={{ backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}