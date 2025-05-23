import React, { useEffect, useState, useRef } from 'react';
import { 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert,
  ActivityIndicator,
  Platform,
  SafeAreaView,
  View,
  Text,
  Image,
  Linking,
  ImageBackground,
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUserAuth } from '@/hooks/useUserAuth';

export default function Login() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();

  const { login, isAuthenticated } = useUserAuth();

  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const passwordRef = useRef<TextInput | null>(null);

  const handleLogin = async () => {
    if (!email || !password) {
      setLoginError('Please enter all fields.');
      Alert.alert('Error', 'Please enter all fields.');
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
          email: email.toLowerCase(),
          password,
        }),
      });

      if (response.ok) {
        const {userAuthToken, refreshToken} = await response.json();
        await login(email.toLowerCase(), userAuthToken, refreshToken);
      } else {
        setLoginError('Invalid email or password.');
        Alert.alert('Error', 'Invalid email or password.');
      }
    } catch (error) {
      setLoginError('Server error. Please try again later.');
      Alert.alert('Error', 'Server error. Please try again later.');
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



 if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  else if (isAuthenticated === true) {
    return <Redirect href="/(logged-in)" />;
  }
  else return (
    <ImageBackground 
      source={require('../assets/images/login0.gif')} 
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
        
        {/* Main content container for the login box */}
        <View style={styles.contentContainer}>
          <View style={styles.loginBox}>
            <Text style={styles.title}>Welcome Back to Centsible!</Text>
            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              autoCapitalize="none"
              returnKeyType="next"  
              onSubmitEditing={() => passwordRef.current && passwordRef.current.focus()}
            />
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={styles.input}
              ref={passwordRef}
              returnKeyType="done"
              onSubmitEditing={handleLogin}
              submitBehavior='blurAndSubmit'
            />
            {loginError && Platform.OS === 'web'? (
              <Text style={styles.errorText}>{loginError}</Text>
            ) : null}
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
    width: '100%',
    height: '100%',
  },
  backgroundImage: {
    resizeMode: 'contain', 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
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
    fontFamily: 'SpaceMono',
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
    fontFamily: 'SpaceMono',
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
    height: 370,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 20,
    padding: 20,
    marginRight: 60,
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
    fontFamily: 'SpaceMono',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontFamily: 'SpaceMono',
  },
  button: {
    backgroundColor: '#71c193',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: 'rgba(113,193,147, 0.9)',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'SpaceMono',
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
    fontFamily: 'SpaceMono',
  },
});
