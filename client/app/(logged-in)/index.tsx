import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import {useRouter} from 'expo-router'
import service from '../../utils/services'




export default function Home() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const handleLogout = async () => {
    const email = await service.getData("email");
    const refreshToken = await service.getData("refreshToken");

    try {
      await fetch(`${API_URL}/users/logout`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          refreshToken
        }),
      });

      await service.clearTokens();

    } catch (e) {
      
    } finally {
      router.replace('/login');
    }
  }

  const addExpense = async () => {
    //takes user to a new page:
    //defaults to current date user can then change date
    //then user can select which category their expense falls into among the given category options
    //then they can enter the amount of their expense
  }

  const createBudget = async () => {
    //takes user to a new page:
    //presents user with a view of all 12 months
    //there is a button to add categories so they can make different categories the expense falls into
    //then they can go into each month and allocate the amount
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centsible</Text>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.title}>Logged In</Text>

      <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogout}
            ><Text style={styles.buttonText}>Log Out</Text></TouchableOpacity>

      <TouchableOpacity 
              style={styles.button} 
              onPress={addExpense}
            ><Text style={styles.buttonText}>Add Expense</Text></TouchableOpacity>

      <TouchableOpacity 
              style={styles.button} 
              onPress={createBudget}
            ><Text style={styles.buttonText}>Create Budget</Text></TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  secondaryButton: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#4a90e2',
  },
  secondaryButtonText: {
    color: '#4a90e2',
    fontWeight: 'bold',
    fontSize: 16,
  },
});