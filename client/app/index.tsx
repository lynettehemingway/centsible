import React, { useRef } from 'react';
import { Redirect, useRouter } from 'expo-router';
import {
  SafeAreaView,
  Animated,
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Linking,
} from 'react-native';
import { useUserAuth } from '@/hooks/useUserAuth';
import { FontAwesome } from '@expo/vector-icons';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const NAVBAR_HEIGHT = 70;

export default function Index() {
  const router = useRouter();
  const { isAuthenticated } = useUserAuth();
  const scrollY = useRef(new Animated.Value(0)).current;

  const goHome   = () => router.replace('/');
  const goLogin  = () => router.replace('/login');
  const goSignup = () => router.replace('/signup');

  if (isAuthenticated === null) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  if (isAuthenticated === true) {
    return <Redirect href="/(logged-in)" />;
  }

  const bannerHeight = SCREEN_HEIGHT - NAVBAR_HEIGHT;

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const sectionOpacity = scrollY.interpolate({
    inputRange: [150, 350],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <Animated.ScrollView
        stickyHeaderIndices={[0]}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
      >
        {/* Navbar */}
        <View style={styles.navBar}>
          <View style={styles.navLeft}>
            <View style={styles.dotRow}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
            <TouchableOpacity onPress={goHome}>
              <Text style={styles.brand}>Centsible</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.logoWrap}>
            <TouchableOpacity onPress={goHome}>
              <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.navRight}>
            {['Home','Log In','Sign Up'].map((t,i) => (
              <TouchableOpacity
                key={t}
                style={styles.navBtn}
                onPress={i===0?goHome:i===1?goLogin:goSignup}
              >
                <Text style={styles.navText}>{t}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={()=>Linking.openURL('https://github.com/lynettehemingway/centsible')}
            >
              <FontAwesome name="github" size={24} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Banner */}
        <Animated.View
          style={[styles.bannerContainer, { height: bannerHeight, opacity: bannerOpacity }]}
        >
          <Image
            source={require('../assets/images/login.gif')}
            style={[styles.bannerImage, { height: bannerHeight }]}
            resizeMode="cover"
          />
          <View style={styles.overlay}>
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>Welcome to Centsible</Text>
              <Text style={styles.infoText}>
                Celebrate your financial wins with a gamified journey to the top.
              </Text>
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.primary} onPress={goLogin}>
                  <Text style={styles.primaryText}>Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.secondary} onPress={goSignup}>
                  <Text style={styles.secondaryText}>Create Account</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Section: Hatching journey */}
        <Animated.View style={[styles.section, { opacity: sectionOpacity }]}>
          <View style={styles.hatchRow}>
            <View style={styles.hatchText}>
            <Text style={styles.sectionTitle}>Your Savings Hatching!</Text>
              <Text style={[styles.sectionText, { marginBottom: 28 }]}>
                Imagine your savings as a tiny egg at the base of a hill. With every dollar you set aside, you give it a little nudge upward. Step by step, your egg climbs toward the summit—until one day, it hatches into something amazing.
              </Text>

              <Text style={styles.sectionTitle}>Goals & Milestones</Text>
              <Text style={styles.sectionText}>
                • 🍳 <Text style={{ fontWeight: '600' }}>Egg Stage:</Text> Just getting started. Set your savings goal and crack open the journey.{"\n"}
                • 🐣 <Text style={{ fontWeight: '600' }}>Chick Stage:</Text> Reach 50% of your target. Your egg is warming up and signs of life begin to stir.{"\n"}
                • 🐔 <Text style={{ fontWeight: '600' }}>Chicken Stage:</Text> You've made it! Your savings have hatched into a fully grown reward—go ahead, treat yourself.
              </Text>

              <Text style={[styles.sectionText, { marginTop: 28 }]}>
                As you save, Centsible transforms your progress into a visual journey. The more consistent you are, the more your egg evolves. Small wins matter. Celebrate streaks, unlock badges, and build habits that last.
              </Text>
            </View>
            <Image
              source={require('../assets/images/chicken1.png')}
              style={styles.hatchImage}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea:   { flex: 1, backgroundColor: '#f5f5f5' },
  loading:    { flex: 1, justifyContent: 'center', alignItems: 'center' },

  /* Navbar */
  navBar:     {
    height: NAVBAR_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(113,193,147,0.9)',
    paddingHorizontal: 10,
    borderTopWidth: 3.5,
    borderBottomWidth: 3.5,
    borderColor: '#000',
    zIndex: 10,
    elevation: 5,
  },
  navLeft:    { flexDirection: 'row', alignItems: 'center' },
  dotRow:     { flexDirection: 'row', alignItems: 'center' },
  dot:        {
    width: 10, height: 10,
    borderWidth: 3, borderColor: '#000',
    borderRadius: 5, marginRight: 4,
    backgroundColor: '#000',
  },
  brand:      { fontSize: 26, fontWeight: 'bold', marginLeft: 15, color: '#000', fontFamily: 'SpaceMono' },
  logoWrap:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo:       { width: 150, height: 60 },
  navRight:   { flexDirection: 'row', alignItems: 'center' },
  navBtn:     { marginHorizontal: 4, padding: 4 },
  navText:    { fontSize: 14, fontWeight: 'bold', color: '#000', fontFamily: 'SpaceMono' },
  iconBtn:    { marginHorizontal: 4, padding: 4 },

  /* Banner */
  bannerContainer:{ width: SCREEN_WIDTH, overflow: 'hidden' },
  bannerImage:    { width: SCREEN_WIDTH },
  overlay:        {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Info box */
  infoBox: {
    width: SCREEN_WIDTH * 0.5,
    backgroundColor: 'rgba(255,255,255,0.65)',
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: '15%', 
  },
  infoTitle:   { fontSize: 28, fontWeight: 'bold', color: '#333', marginBottom: 8, fontFamily: 'SpaceMono' },
  infoText:    { fontSize: 16, color: '#555', marginBottom: 20, textAlign: 'center', fontFamily: 'SpaceMono' },

  buttonRow:   { flexDirection: 'row', width: '100%', justifyContent: 'space-between' },
  primary:     { flex:1, marginRight:8, backgroundColor: '#4BA37E', paddingVertical:14, borderRadius:8, alignItems:'center' },
  primaryText: { color:'#fff', fontSize:16, fontWeight:'bold', fontFamily: 'SpaceMono', },
  secondary:   { flex:1, marginLeft:8, borderWidth:1, borderColor:'#4BA37E', paddingVertical:14, borderRadius:8, alignItems:'center' },
  secondaryText:{ color:'#4BA37E', fontSize:16, fontWeight:'bold', fontFamily: 'SpaceMono', },

  /* Section */
  section:      { width:'90%', alignSelf:'center', marginTop:20, marginBottom:60 },

  hatchRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    paddingVertical: 30,
    gap: 12,
  },
  hatchText: {
    flex: 1,
    paddingRight: 16,
    paddingLeft: 8,
  },
  hatchImage: {
    width: SCREEN_WIDTH * 0.35,
    height: SCREEN_WIDTH * 0.35,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2f2f2f',
    marginBottom: 16,
    textAlign: 'left',
  },
  sectionText: {
    fontSize: 18,
    color: '#444',
    lineHeight: 28,
    textAlign: 'left',
    fontFamily: 'SpaceMono',
  },

});
