import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,        
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUserAuth } from '@/hooks/useUserAuth';

export default function Home() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { logout } = useUserAuth();

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('name');
        if (stored) setName(stored);
      } catch (e) {
        console.warn('Failed to load name', e);
      }
    })();
  }, []);

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

  const navigate = (path: string) => () => {
    router.push(path as any);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Sidebar */}
        <View style={styles.sidebar}>
          {/* Brand with logo + text */}
          <View style={styles.brandContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
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

        {/* Main Content */}
        <View style={styles.main}>
          <Text style={styles.welcome}>
            Welcome back, {name || 'User'}!
          </Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.button}
              onPress={navigate('/(logged-in)/addexpense')}
            >
              <Text style={styles.buttonText}>+ Add Expense</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={navigate('/(logged-in)/createbudget')}
            >
              <Text style={styles.buttonText}>📊 Create Budget</Text>
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

  sidebar: {
    width: 200,
    backgroundColor: '#71c193',
    paddingTop: 40,
    paddingLeft: 20,
    paddingHorizontal: 10,
  },

  // new container for logo + brand text
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingLeft: 5,
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
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1.2, height: 1 },
    textShadowRadius: 1,
    marginLeft: 10,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginVertical: 20,
  },

  main: {
    flex: 1,
    padding: 30,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  actions: {
    flexDirection: 'row',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#4a90e2',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginRight: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
