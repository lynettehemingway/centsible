import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "./authFetch";

export const fetchUserData = async () => {
    fetchName();
    fetchCategories();
}

export const clearUserData = async () => {
    await AsyncStorage.multiRemove(['name', 'categories',]);
}

export const fetchName = async () => {
    try {
        const response = await authFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/users/data/getname`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' }, }
              );
        
        const { name } = await response.json();

        const ret = await AsyncStorage.setItem('name', name);
        console.log(`name ;${name}`);
        return ret;
    }
    catch (err){
        return null;
    }
}

export const getName = async () => {
    try {
        return await AsyncStorage.getItem('name');
    } catch (e) {
        return null;
    }
}

export const fetchCategories = async () => {
    try {
        const response = await authFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/users/data/getcategories`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' }, }
              );
        
        const { categories } = await response.json();

        return await AsyncStorage.setItem('categories', JSON.stringify(categories));
    }
    catch (err){
        return null;
    }
}

export const getCategories = async () => {
    try {
      const categories = await AsyncStorage.getItem('categories');
      return categories ? JSON.parse(categories) : null;
    } catch (err) {
      return null;
    }
  };