import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      // saving error
    }
  };

const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value != null) {
      return value;
    }
  } catch (e) {
    // error reading value
  }
};

const clearTokens = async () => {
  try {
    await AsyncStorage.removeItem("userAuthToken");
    await AsyncStorage.removeItem("refreshToken");
  } catch (e) {

  }
}

export default {
    storeData,
    getData,
    clearTokens
}