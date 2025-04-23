import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Alert, Platform, TouchableOpacity } from 'react-native';
import Sidebar from '@/components/Sidebar';
import { useUserAuth } from '@/hooks/useUserAuth';
import { authFetch } from '@/utils/authFetch';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';


export default function CreateBudget() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { logout } = useUserAuth();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('0.00');
  const [timeperiod, setTimeperiod] = useState('Monthly');

  const [addError, setAddError] = useState<string | null>(null);

  const handleLogout = async () => {
    setLoading(true);
    try {
      const email = await AsyncStorage.getItem('email');
      const refreshToken = await AsyncStorage.getItem('refreshToken');
      await fetch(`${API_URL}/users/logout`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, refreshToken }),
      });
    } catch (e) {
      console.warn('Logout error', e);
    } finally {
      await AsyncStorage.multiRemove(['userAuthToken', 'refreshToken', 'email', 'name']);
      await logout();
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
      if (!amount || name === '' || amount === '0.00') {
        Alert.alert('Error', 'Please fill out all fields.');
        setAddError('Please fill out all fields.');
        return;
      }
  
      setLoading(true);
  
      const expense = {
        name: name,
        timeperiod: timeperiod,
        amount: amount
      };
      
  
      try {
        const response = await authFetch(
          `${process.env.EXPO_PUBLIC_API_URL}/users/data/addbudget`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(expense),
          }
        );
  
        if (response.ok) {
          router.replace('/(logged-in)');
        }
        else{
          setAddError('Unable to add expense.')
          Alert.alert('Error', 'Unable to add expense.');
        }
      } catch (e) {
        setAddError('Server error. Please try again later.');
        Alert.alert('Error', 'Server error. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Sidebar loading={loading} handleLogout={handleLogout} />
        <View style={styles.main}>
          <Text style={styles.header}>Create Budget</Text>
          <View style={styles.formGroup}>
          <Text style={styles.label}>Budget Name</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Groceries, Vacation" />

          <Text style={styles.label}>Amount ($)</Text>
          <TextInput style={styles.input} placeholder="0.00" value={amount} onChangeText={setAmount} keyboardType="decimal-pad" />

          <Text style={styles.label}>Time Period</Text>
          <View style={styles.pickerContainer}>
            <Picker selectedValue={timeperiod} onValueChange={(timeperiod) => {setTimeperiod(timeperiod)}} style={styles.input}>
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
              <Picker.Item label="Yearly" value="Yearly" />
            </Picker>
          </View>
          {addError && Platform.OS === 'web'? (
                        <Text style={styles.errorText}>{addError}</Text>
                      ) : null}

        <TouchableOpacity
                      style={[styles.button, loading && styles.disabledButton]}
                      onPress={handleSubmit}
                      disabled={loading}
                    >
                      <Text style={styles.buttonText}>
                                      {loading ? 'Adding...' : 'Add Budget'}
                                    </Text>
                    </TouchableOpacity>
        </View>

        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, flexDirection: 'row' },
  main: { flex: 1, padding: 30 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  formGroup: {
    gap: 14,
  },
  button: {
    marginTop: 24,
    backgroundColor: '#4a90e2',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#a0c4ff',
  },
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    color: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
});
