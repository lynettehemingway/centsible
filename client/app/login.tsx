import React, { useEffect, useState } from 'react';
import { 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  Linking,
  ImageBackground
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import service from '../utils/services';

export default function Login() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    console.log(`API_URL: ${API_URL}`);
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        await service.storeData('userAuthToken', data.userAuthToken);
        await service.storeData('refreshToken', data.refreshToken);
        await service.storeData('email', email);
        router.replace('/(logged-in)');
      } else {
        Alert.alert('Error', data || 'Login failed');
      }
    } catch (error) {
      Alert.alert('Connection Error', 'Cannot reach the server. Check your network.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const navigateSignup = async () => {
    router.replace('/signup');
  };

  const navigateIndex = () => {
    router.replace('/');
  };

  return (
    <ImageBackground 
      source={require('../assets/images/banner.png')} 
      style={styles.background} 
      resizeMode="cover"
    >
      <SafeAreaView style={styles.outerContainer}>
        {/* Navbar stays at the top, full width */}
        <View style={styles.navBar}>
          <View style={styles.navLeft}>
            <View style={styles.dotContainer}>
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
            </View>
            {/* Wrap the brand text in a touchable for navigation to index */}
            <TouchableOpacity onPress={navigateIndex}>
              <Text style={styles.brandText}>Centsible</Text>
            </TouchableOpacity>
          </View>
          {/* Center: Logo wrapped in touchable */}
          <View style={styles.logoContainer}>
            <TouchableOpacity onPress={navigateIndex}>
              <Image 
                source={require('../assets/images/logo.png')} 
                style={styles.logo} 
                resizeMode="contain" 
              />
            </TouchableOpacity>
          </View>
          {/* Right: Navigation Buttons */}
          <View style={styles.navRight}>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/login')}>
              <Text style={styles.navButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/signup')}>
              <Text style={styles.navButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL('https://github.com/your-repo')}
            >
              <FontAwesome name="github" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Main content container for the login box */}
        <View style={styles.contentContainer}>
          <View style={styles.loginBox}>
            <Text style={styles.title}>Centsible</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
            />
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={navigateSignup}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  outerContainer: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  navBar: {
    width: '100%',
    height: 70,
    backgroundColor: 'rgba(113,193,147, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderWidth: 3.5,
    borderLeftWidth: 0, 
    borderRightWidth: 0,
    borderColor: '#000',
  },
  navLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderWidth: 3,
    borderColor: '#000',
    borderRadius: 5,
    marginRight: 4,
  },
  brandText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: 15,
    color: '#000',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
  navRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  navButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  navButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconButton: {
    marginHorizontal: 4,
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 20,
  },
  loginBox: {
    width: '35%',
    height: 350,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginRight: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
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
    backgroundColor: '#71c193',
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
    borderColor: '#71c193',
  },
  secondaryButtonText: {
    color: '#71c193',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
