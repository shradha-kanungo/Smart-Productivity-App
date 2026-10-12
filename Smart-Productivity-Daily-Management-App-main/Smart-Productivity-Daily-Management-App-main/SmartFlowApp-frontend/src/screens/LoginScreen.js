import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CommonActions } from '@react-navigation/native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('test@gmail.com');
  const [password, setPassword] = useState('123456');

  const handleLogin = async () => {
    await AsyncStorage.setItem('token', 'demo-token-123');
    await AsyncStorage.setItem('user', JSON.stringify({ email }));
    // YE LINE FIX HAI - REPLACE ki jagah RESET
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      })
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#0F0F14', justifyContent: 'center', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 }}>Welcome Back</Text>
      <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#666" style={{ backgroundColor: '#1E1E26', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 12 }} />
      <TextInput value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry placeholderTextColor="#666" style={{ backgroundColor: '#1E1E26', color: '#fff', padding: 14, borderRadius: 12, marginBottom: 20 }} />
      <TouchableOpacity onPress={handleLogin} style={{ backgroundColor: '#6366F1', padding: 16, borderRadius: 12, alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')} style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ color: '#9CA3AF' }}>No account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}