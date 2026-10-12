import AsyncStorage from '@react-native-async-storage/async-storage';
export const save = (k,v) => AsyncStorage.setItem(k, JSON.stringify(v));
export const get = async (k) => { const v = await AsyncStorage.getItem(k); return v ? JSON.parse(v) : null; };