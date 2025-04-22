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
  Linking,
  Platform,
  ImageBackground
} from 'react-native';
import { useRouter, Redirect } from 'expo-router';
import { useUserAuth } from '@/hooks/useUserAuth';
import { FontAwesome } from '@expo/vector-icons';

export default function Signup() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  
  const { login, isAuthenticated } = useUserAuth();

  const [loading, setLoading] = useState(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const emailInputRef = useRef<TextInput | null>(null);
  const passwordInputRef = useRef<TextInput | null>(null);

  const navigateIndex = () => {
    router.replace('/');
  };

  const navigateLogin = async () => {
    router.replace('/login');
  };

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please enter all fields.');
      setSignupError('Please enter all fields.');
      return;
    }
  
    //TO-DO: add email verification, use setSignupError('Please enter a valid email.') when invalid email

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
        const { userAuthToken, refreshToken } = await response.json();
        await login(email, userAuthToken, refreshToken);
      } else {
        const error = await response.text();
        setSignupError(error || 'Account creation failed.');
        Alert.alert('Error', error || 'Account creation failed.');
      }
    } catch (e) {
      setSignupError('Server error. Please try again later.');
      Alert.alert('Error', 'Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  } else if (isAuthenticated === true) {
    return <Redirect href="/(logged-in)" />;
  } else return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground 
        source={require('../assets/images/signup.gif')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <ScrollView contentContainerStyle={styles.landingContainer}>
          <View style={styles.navBar}>
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
            <View style={styles.logoContainer}>
              <TouchableOpacity onPress={navigateIndex}>
                <Image 
                  source={require('../assets/images/logo.png')} 
                  style={styles.logo} 
                  resizeMode="contain" 
                />
              </TouchableOpacity>
            </View>
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

          <View style={styles.contentContainer}>
            <View style={styles.signupBox}>
              <Text style={styles.title}>Create Your Account to Start Saving!</Text>
              <TextInput
                placeholder="Name"
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
                ref={emailInputRef}
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
              {signupError && Platform.OS === 'web' ? (
                <Text style={styles.errorText}>{signupError}</Text>
              ) : null}
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
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  landingContainer: {
    flexGrow: 1,
    backgroundColor: 'transparent',
    paddingBottom: 20,
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
    fontFamily: 'SpaceMono',
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
    fontFamily: 'SpaceMono',
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
    backgroundColor: '#a0c4ff',
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
