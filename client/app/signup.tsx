import React, { useRef, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Linking
} from 'react-native';
import { Redirect, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import service from '../utils/services';

export default function Signup() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const emailInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);

  // Navigation functions
  const navigateIndex = () => {
    router.replace('/');
  };

  const navigateLogin = async () => {
    router.replace('/login');
  };

  const handleSignup = async () => {
    if (!email || !name || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
  
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      if (response.ok) {
        Alert.alert('Success', 'Account created! Please login');
        router.replace('/login');
      } else {
        const error = await response.text();
        Alert.alert('Error', error || 'Account creation failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Cannot connect to server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.landingContainer}>
        {/* Navbar divided into three sections */}
        <View style={styles.navBar}>
          {/* Left: Dots & Brand Text wrapped in TouchableOpacity */}
          <View style={styles.navLeft}>
            <View style={styles.dotContainer}>
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
            </View>
            <TouchableOpacity onPress={navigateIndex}>
              <Text style={styles.brandText}>Centsible</Text>
            </TouchableOpacity>
          </View>
          {/* Center: Logo wrapped in TouchableOpacity */}
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
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/')}>
              <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/login')}>
              <Text style={styles.navButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={() => router.push('/signup')}>
              <Text style={styles.navButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => Linking.openURL('https://github.com/lynettehemingway/centsible')}
            >
              <FontAwesome name="github" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Sign up form container aligned to the left */}
        <View style={styles.contentContainer}>
          <View style={styles.signupBox}>
            <Text style={styles.title}>Create Your Account to Start Saving!</Text>
            <TextInput
              placeholder="Username"
              value={name}
              onChangeText={setName}
              style={styles.input}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                if (emailInputRef.current) {
                  emailInputRef.current.focus();
                }
              }}
            />
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => {
                if (passwordInputRef.current) {
                  passwordInputRef.current.focus();
                }
              }}
            />
            <TextInput
              ref={passwordInputRef}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              returnKeyType="done"
              onSubmitEditing={handleSignup}
            />
            <TouchableOpacity 
              style={[styles.button, loading && styles.disabledButton]} 
              onPress={handleSignup}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.secondaryButton} 
              onPress={navigateLogin}
              disabled={loading}
            >
              <Text style={styles.secondaryButtonText}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  landingContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  // Navbar with a pixelated look and thicker borders
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
  // Left section: dots and brand text.
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
  // Center section: logo container (centers the logo).
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 150,
    height: 60,
  },
  // Right section: navigation buttons.
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
  // Content container: align signup box to the left.
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start', // left align the signup box
    paddingLeft: 20,
  },
  signupBox: {
    width: '35%',
    height: 430,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginLeft: 60,
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
