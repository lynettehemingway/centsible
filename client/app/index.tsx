import React, { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import service from '../utils/services';

export default function Index() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const [isAuthenticated, setAuthenticated] = useState<'check' | 'auth' | 'noauth'>('check');

  useEffect(() => {
    const checkUserAuth = async () => {
      const userAuthToken = await service.getData('userAuthToken');
      console.log('User Token:', userAuthToken);
      if (!userAuthToken) {
        setAuthenticated('noauth');
        return;
      }
      try {
        const response = await fetch(`${API_URL}/users/`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userAuthToken}`,
          },
        });
        if (response.ok) setAuthenticated('auth');
<<<<<<< HEAD
        else setAuthenticated('noauth');
      } catch (error) {
        console.error(error);
        setAuthenticated('noauth');
      }
    };
    checkUserAuth();
  }, []);
=======
        else {
            const userRefreshToken  = await service.getData('refreshToken');
            if (!userAuthToken) setAuthenticated('noauth');
            else {
                const response = await fetch(`${API_URL}/users/refresh`, {
                    method: 'GET',
                    headers: {
                    'Authorization': `Bearer ${userRefreshToken}`
                    },
                });

                if (response.ok){
                    const data = await response.json();

                    await service.storeData('userAuthToken', data.userAuthToken);
                    setAuthenticated('auth');
                }
                else setAuthenticated('noauth');
            }
        }
        }
        catch (err) {
            setAuthenticated('noauth');
        }
        }
>>>>>>> 671b79692e4653ccc20b924c1724f25a14e09926

  // While checking authentication, show a loading indicator.
  if (isAuthenticated === 'check') {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  // If authenticated, redirect to the logged-in route.
  if (isAuthenticated === 'auth') {
    return <Redirect href="/(logged-in)" />;
  }

  // When not authenticated, render the landing page.
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.landingContainer}>
        {/* Navbar divided into three sections */}
        <View style={styles.navBar}>
          {/* Left: Dots & Brand Text */}
          <View style={styles.navLeft}>
            <View style={styles.dotContainer}>
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
              <View style={[styles.dot, { backgroundColor: 'black' }]} />
            </View>
            <Text style={styles.brandText}>Centsible</Text>
          </View>
          {/* Center: Logo */}
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/logo.png')} 
              style={styles.logo} 
              resizeMode="contain" 
            />
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

        {/* Banner Image */}
        <Image 
          source={require('../assets/images/banner.png')} 
          style={styles.banner} 
          resizeMode="cover" 
        />

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Text style={styles.landingTitle}>Welcome to Centsible</Text>
          <Text style={styles.landingText}>
            Budgeting made fun.
          </Text>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    backgroundColor: '#71c193',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,  // Extra horizontal padding for space.
    borderWidth: 3.5,
    borderLeftWidth: 0, 
    borderRightWidth: 0,
    borderColor: '#000',
    marginBottom: 0,
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
    marginLeft: 15,  // Extra space between dots and text.
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
  banner: {
    width: '100%',
    height: 500,
    marginBottom: 20,
  },
  textContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
    paddingHorizontal: 10,
  },
  landingTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  landingText: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
  },
});
