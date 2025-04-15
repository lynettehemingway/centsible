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

//Might be incorrect
const addExpense = async (expenseData) => {
  console.log('Received expense data:', expenseData);
  // Simulate an API call or store logic
  return new Promise((resolve) => setTimeout(resolve, 500));
};
//

export default {
    storeData,
    getData,
    clearTokens,
    addExpense
}