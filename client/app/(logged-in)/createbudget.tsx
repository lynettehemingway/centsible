import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';
import service from '../../utils/userAuthStorage';

export default function CreateBudget() {
    return (
      <View style={styles.container}>
        <Text>Create budget</Text>
      </View>
    );
}
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f5f5f5',
    },
});