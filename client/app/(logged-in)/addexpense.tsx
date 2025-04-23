import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Pressable,
} from 'react-native';
import DateTimePicker, { DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { authFetch } from '@/utils/authFetch';
import Sidebar from '@/components/Sidebar';
import { getEmail, getRefreshToken } from '@/utils/userAuthStorage';
import { getCategories } from '@/utils/userDataStorage';
import { useUserAuth } from '@/hooks/useUserAuth';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

export default function AddExpense() {
  const router = useRouter();
  
  const [date, setDate] = useState<DateType>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [amount, setAmount] = useState('0.00');

  const [loading, setLoading] = useState(false);

  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const { logout } = useUserAuth();

  const handleLogout = async () => {
    setLoading(true);
    try {
      const email = await getEmail();
      const refreshToken = await getRefreshToken();
      await fetch(`${API_URL}/users/logout`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, refreshToken }),
      });
    } catch (e) {
      console.warn('Logout error', e);
    } finally {
      await logout();
      setLoading(false);
    }
  };

  const [addError, setAddError] = useState<string | null>(null);

  const handleNumBlur = () => {
    const num = parseFloat(amount.replace(/[^0-9.]/g, ''));
    if (isNaN(num)) setAmount('0.00');
    else setAmount(num.toFixed(2));
  }

  const handleSubmit = async () => {
    const formattedDate = date ? dayjs(date).toDate() : null;
    if (!amount || !formattedDate || category === null || amount === '0.00') {
      Alert.alert('Error', 'Please enter an amount.');
      setAddError('Please enter an amount.');
      return;
    }

    setLoading(true);

    const expense = {
      date: formattedDate.toISOString(),
      category: category,
      amount: amount
    };
    

    try {
      const response = await authFetch(
        `${process.env.EXPO_PUBLIC_API_URL}/users/data/addexpense`,
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

  const loadCategories = async () => {
    const data = await getCategories();
    if (Array.isArray(data)){
      setCategories(data);
      setCategory(data[0]);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Sidebar loading={loading} handleLogout={handleLogout} />
        <View style={styles.main}>
          <Text style={styles.header}>Add Expense</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Date</Text>
            <View style={{zIndex: 1}}>
              <TouchableOpacity
                style={[styles.input, {zIndex: 1}]}
                onPress={() => setShowPicker(!showPicker)}
              >
                <Text>{dayjs(date).format('MMM D, YYYY (h:mm A)')}</Text>
                
              </TouchableOpacity>
              {showPicker && (
                <>
                <DateTimePicker
                date={date}
                mode="single"
                timePicker
                use12Hours
                style={styles.calendarOverlay}
                styles={{
                  today: { borderWidth: 1, borderColor: '#ddd' , borderRadius: 8 },
                  selected: { backgroundColor: 'rgba(113,193,147, 0.9)', borderRadius: 8 },
                  button_next: {backgroundColor: '#ddd'},
                  button_prev: {backgroundColor: '#ddd'},
                }}
                onChange={({ date }) =>  setDate(date)}
              />
              <Pressable style={styles.calendarBack} onPress={() => setShowPicker(false)}/>
              </>
              )}
            </View>
            <Text style={styles.label}>Category</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(val) => setCategory(val)}
                style={styles.input}
              >
                {categories.map((c) => (
                  <Picker.Item key={c} label={c} value={c} />
                ))}
              </Picker>
            </View>

            <Text style={styles.label}>Amount ($)</Text>
            <TextInput
              placeholder="0.00"
              value={amount}
              keyboardType="decimal-pad"
              inputMode="decimal"
              onChangeText={setAmount}
              onBlur={handleNumBlur}
              style={styles.input}
            />
            {addError && Platform.OS === 'web'? (
              <Text style={styles.errorText}>{addError}</Text>
            ) : null}

            <TouchableOpacity
              style={[styles.button, loading && styles.disabledButton]}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Saving...' : 'Save Expense'}
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
  formArea: {
    flex: 1,
    padding: 20,
  },
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
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    textAlign: 'center',
  },
  calendarOverlay: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'absolute',
    width: '50%',
    height: 'auto',
    top: '100%',
    left: '0%',
    zIndex: 1,
  },
  calendarBack: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: height,
    width: width,
    cursor: 'default' as any,
  }
});