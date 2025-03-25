import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import {useRouter} from 'expo-router'
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Home() {
  const router = useRouter();
  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      
    } finally {
      console.log("cleared data");
      router.replace('/login');
    }
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Centsible</Text>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.title}>Logged In</Text>

      <TouchableOpacity 
              style={styles.button} 
              onPress={handleLogout}
            ><Text style={styles.ButtonText}>Log Out</Text></TouchableOpacity>
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