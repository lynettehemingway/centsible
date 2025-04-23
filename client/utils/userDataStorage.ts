import AsyncStorage from "@react-native-async-storage/async-storage";
import { authFetch } from "./authFetch";

export const fetchUserData = async () => {
    fetchName();
    fetchCategories();
    fetchSummary();
    fetchBudgets();
}

export const clearUserData = async () => {
    await AsyncStorage.multiRemove(['name', 'categories', 'summary', 'budgets']);
}

export const fetchName = async () => {
    try {
        const response = await authFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/users/data/getname`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' }, }
              );
        
        const { name } = await response.json();

        const ret = await AsyncStorage.setItem('name', name);
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

export const fetchBudgets = async () => {
    try {
        const response = await authFetch(
                `${process.env.EXPO_PUBLIC_API_URL}/users/data/getbudgets`,
                { method: 'GET', headers: { 'Content-Type': 'application/json' }, }
              );
        
        const { budgets } = await response.json();

        return await AsyncStorage.setItem('budgets', JSON.stringify(budgets));
    }
    catch (err){
        return null;
    }
}

export const getBudgets = async () => {
    try {
      const budgets = await AsyncStorage.getItem('budgets');
      return budgets ? JSON.parse(budgets) : null;
    } catch (err) {
      return null;
    }
  };

export const getCategories = async () => {
    try {
      const categories = await AsyncStorage.getItem('categories');
      return categories ? JSON.parse(categories) : null;
    } catch (err) {
      return null;
    }
  };

export const fetchSummary = async () => {
    try {
        const date = new Date();
        const response = await authFetch(
            `${process.env.EXPO_PUBLIC_API_URL}/users/data/expenses/summary?month=${date.getMonth()}&year=${date.getFullYear()}`,
            { method: 'GET', headers: { 'Content-Type': 'application/json' }, }
          );
        
        const summary = await response.json();
        return await AsyncStorage.setItem('summary', JSON.stringify(summary));
    } catch (err) {
        return null;
    }
}

export const getSummary = async () => {
    try {
        const summary = await AsyncStorage.getItem('summary');
        return summary ? JSON.parse(summary) : null;
    } catch (err) {
        return null;
    }
}