import AsyncStorage from '@react-native-async-storage/async-storage';

export const getEmail = async () => {
  try {
    return await AsyncStorage.getItem('email');
  } catch (e) {
    return null;
  }
}

export const setEmail = async (email: string) => {
  try {
    return await AsyncStorage.setItem('email', email);
  } catch (e) {
    return null;
  }
}

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem('userAuthToken');
  } catch (e) {
    return null;
  }
}

export const setAuthToken = async (token: string) => {
  try {
    return await AsyncStorage.setItem('userAuthToken', token);
  } catch (e) {
    return null;
  }
}

export const getRefreshToken = async () => {
  try {
    return await AsyncStorage.getItem('refreshToken');
  } catch (e) {
    return null;
  }
}

export const setRefreshToken = async (token: string) => {
  try {
    return await AsyncStorage.setItem('refreshToken', token);
  } catch (e) {
    return null;
  }
}

export const clearTokens = async () => {
  await AsyncStorage.multiRemove(['email', 'userAuthToken', 'refreshToken']);
}