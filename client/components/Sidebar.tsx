import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useUserAuth } from '@/hooks/useUserAuth';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Sidebar({ loading, handleLogout }: { loading: boolean; handleLogout: () => void }) {
  const router = useRouter();
  const navigate = (path: string) => () => {
    router.push(path as any);
  };

  return (
    <View style={styles.sidebar}>
      <View style={styles.brandContainer}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.sidebarLogo}
          resizeMode="contain"
        />
        <Text style={styles.brand}>Centsible</Text>
      </View>

      <TouchableOpacity style={styles.link} onPress={navigate('/')}>
        <FontAwesome name="home" size={20} color="#fff" />
        <Text style={styles.linkText}>Home</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={navigate('/(logged-in)/addexpense')}>
        <FontAwesome name="plus-circle" size={20} color="#fff" />
        <Text style={styles.linkText}>Add Expense</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.link} onPress={navigate('/(logged-in)/createbudget')}>
        <FontAwesome name="pie-chart" size={20} color="#fff" />
        <Text style={styles.linkText}>Create Budget</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.link} onPress={handleLogout}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <FontAwesome name="sign-out" size={20} color="#fff" />
            <Text style={styles.linkText}>Log Out</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 200,
    backgroundColor: '#71c193',
    paddingTop: 40,
    paddingLeft: 20,
    paddingHorizontal: 10,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  sidebarLogo: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  brand: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1.2, height: 1 },
    textShadowRadius: 1,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 20,
  },
});
