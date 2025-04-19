import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker, { DateType, useDefaultStyles } from 'react-native-ui-datepicker';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';

export default function AddExpense() {
  const router = useRouter();
  const defaultStyles = useDefaultStyles();
  const [date, setDate] = useState<DateType>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // const handleSubmit = async () => {
  //   if (!amount) {
  //     Alert.alert('Error', 'Please enter an amount.');
  //     return;
  //   }

  //   setLoading(true);
  //   const token = await service.getData('userAuthToken');

  //   try {
  //     const response = await fetch(
  //       `${process.env.EXPO_PUBLIC_API_URL}/users/addexpense`,
  //       {
  //         method: 'POST',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           Authorization: `Bearer ${token}`,
  //         },
  //         body: JSON.stringify({
  //           date: date?.toLocaleString(),
  //           category,
  //           amount: parseFloat(amount),
  //         }),
  //       }
  //     );

  //     if (!response.ok) {
  //       throw new Error('Failed to save expense');
  //     }

  //     // go back to dashboard or previous screen
  //     router.back();
  //   } catch (e) {
  //     console.error(e);
  //     Alert.alert('Error', 'Failed to add expense.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // const loadCategories = async () => {
  //   try {
  //       const storedCategories = await service.getData('categories');
  //       if (storedCategories) {
  //           const parsed = JSON.parse(storedCategories);
  //           setCategories(parsed);
  //           setCategory(parsed[0]);
  //       }
  //   } catch (error) {
  //       console.error('Failed to load categories');
  //       router.back();
  //   }
  // }

  // useEffect(() => {
  //   loadCategories();
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text>{date?.toString()}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          date={date}
          mode="single"
          styles={{
            ...defaultStyles,
            header: {color: 'black'},
            days: {color: 'black'},
            day_label: {color: 'black'},
            month_selector_label: {color: 'black'},
            year_selector_label: {color: 'black'},
            selected_month: {color: 'black'},
            today: { backgroundColor: '#ddd' },
            today_label: { color: 'black'},
            selected: { backgroundColor: 'rgba(113,193,147, 0.9)' },
            button_next: {backgroundColor: '#ddd'},
            button_prev: {backgroundColor: '#ddd'}
          }}
          onChange={({ date }) =>  setDate(date)}
        />
      )}

      <Text style={styles.label}>Category</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={(val) => setCategory(val)}
        >
          {categories.map((c) => (
            <Picker.Item key={c} label={c} value={c} />
          ))}
        </Picker>
      </View>

      <Text style={styles.label}>Amount</Text>
      <TextInput
        style={styles.input}
        placeholder="0.00"
        keyboardType="decimal-pad"
        value={amount}
        onChangeText={setAmount}
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.disabledButton]}
        //onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Saving...' : 'Save Expense'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
});