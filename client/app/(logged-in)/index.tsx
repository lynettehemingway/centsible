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
import { getName } from '@/utils/userDataStorage';
import Sidebar from '@/components/Sidebar';


export default function Home() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { logout } = useUserAuth();

  const [name, setName] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const name = await getName();
      if (name) setName(name);
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
        <Sidebar loading={loading} handleLogout={handleLogout} />

        {/* Main Content */}
        <View style={styles.main}>
          <Text style={styles.welcome}>Welcome back, {name || 'User'}!</Text>

          {/* Widget Grid */}
          <View style={styles.widgetsContainer}>
            {/* Expenses Summary Widget */}
            <TouchableOpacity
              style={styles.widgetBox}
              onPress={navigate('/(logged-in)/addexpense')}
            >
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>Expenses Summary</Text>
                <FontAwesome name="bar-chart" size={20} color="#4a90e2" />
              </View>
              {/* Placeholder for chart / data */}
              <View style={styles.widgetContent}>
                <Text style={styles.placeholderText}>[Monthly chart here]</Text>
              </View>
            </TouchableOpacity>

            {/* Budget Overview Widget */}
            <TouchableOpacity
              style={styles.widgetBox}
              onPress={navigate('/(logged-in)/createbudget')}
            >
              <View style={styles.widgetHeader}>
                <Text style={styles.widgetTitle}>Budget Overview</Text>
                <FontAwesome name="pie-chart" size={20} color="#4a90e2" />
              </View>
              <View style={styles.widgetContent}>
                <Text style={styles.placeholderText}>[Budget breakdown]</Text>
              </View>
            </TouchableOpacity>
          </View>

          <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <Image
              source={require('../../assets/images/banner.png')}
              style={styles.progressImage}
              resizeMode="contain"
            />
          </View>
          
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, flexDirection: 'row' },

  /* Sidebar */
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

  /* Main Content */
  main: {
    flex: 1,
    padding: 30,
  },
  welcome: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    marginLeft: 20,
    marginTop: 30,
  },

  /* Widget grid container */
  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  /* Individual widget box */
  widgetBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20, // space below each box
    // shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android
  },
  widgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  widgetContent: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontStyle: 'italic',
  },

  /* Button placeholders */
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

    /* Progress area below widgets */
    progressContainer: {
      marginTop: 20,
      alignSelf: 'center',
      backgroundColor: '#fff',
      borderRadius: 12,
      padding: 16,
      width: '50%',
      height: '40%',
      // shadow (iOS)
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      // elevation (Android)
      elevation: 3,
      alignItems: 'center',
    },
    progressTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#333',
      marginBottom: 12,
    },
    progressImage: {
      width: '100%',
      height: 150,
    },
  
});
