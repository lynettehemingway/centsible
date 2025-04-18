import React, { useEffect, useState } from 'react';
import { Redirect, useRouter } from 'expo-router';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useUserAuth } from '@/hooks/useUserAuth';
import { FontAwesome } from '@expo/vector-icons';

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useUserAuth();

  
  const navigateIndex = () => {
    router.replace('/');
  };

  const navigateLogin = () => {
    router.replace('/login');
  };

  const navigateSignup = () => {
    router.replace('/signup');
  }



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
            <TouchableOpacity style={styles.navButton} onPress={navigateIndex}>
              <Text style={styles.navButtonText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={navigateLogin}>
              <Text style={styles.navButtonText}>Log In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navButton} onPress={navigateSignup}>
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
  landingContainer: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    paddingBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
