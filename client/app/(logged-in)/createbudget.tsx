import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Sidebar from '@/components/Sidebar';
import { useUserAuth } from '@/hooks/useUserAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';


export default function CreateBudget() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { logout } = useUserAuth();
  const [loading, setLoading] = useState(false);

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

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Sidebar loading={loading} handleLogout={handleLogout} />
        <View style={styles.main}>
          <Text style={styles.header}>Create Budget</Text>
          <View style={styles.formGroup}>
          <Text style={styles.label}>Budget Name</Text>
          <TextInput style={styles.input} placeholder="e.g. Groceries, Vacation" />

          <Text style={styles.label}>Amount ($)</Text>
          <TextInput style={styles.input} placeholder="0.00" keyboardType="decimal-pad" />

          <Text style={styles.label}>Time Period</Text>
          <View style={styles.input}>
            <Picker selectedValue={'Monthly'} onValueChange={() => {}}>
              <Picker.Item label="Weekly" value="Weekly" />
              <Picker.Item label="Monthly" value="Monthly" />
              <Picker.Item label="Yearly" value="Yearly" />
            </Picker>
          </View>
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
  label: {
    marginTop: 12,
    marginBottom: 4,
    fontSize: 16,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});
