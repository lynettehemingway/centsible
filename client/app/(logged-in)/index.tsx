import React, { useEffect, useState, useCallback } from 'react';
import LottieView from 'lottie-react-native';

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  ScrollView,
} from 'react-native';
import {
  VictoryChart,
  VictoryBar,
  VictoryAxis,
  VictoryTheme,
} from 'victory';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useUserAuth } from '@/hooks/useUserAuth';
import { getName, getSummary, fetchUserData } from '@/utils/userDataStorage';
import Sidebar from '@/components/Sidebar';

type SummaryItem = {
  category: string;
  totalAmount: number;
};

type FormattedSummaryItem = {
  x: string;
  y: number;
};

export default function Home() {
  const API_URL = process.env.EXPO_PUBLIC_API_URL;
  const router = useRouter();
  const { logout } = useUserAuth();

  const [name, setName] = useState<string>('');
  const [summary, setSummary] = useState<FormattedSummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapExists, setMapExists] = useState(false);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const [currentAmount, setCurrentAmount] = useState(0);
  const [goalAmount, setGoalAmount] = useState(1); // default to 1 to avoid div-by-zero


useFocusEffect(
  useCallback(() => {
    let isActive = true; // optional safety if async runs after unmount

    (async () => {
      await fetchUserData();
      const name = await getName();
      if (isActive && name) setName(name);

      const result = await getSummary() as SummaryItem[];
      if (isActive && result) {
        setMapExists(true);
        const formatted = result.map(item => ({
          x: item.category,
          y: item.totalAmount,
        }));
        setSummary(formatted);
      }

      if (isActive) setLoading(false);
    })();

    return () => {
      isActive = false;
    };
  }, [])
);

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
      await logout();
      setLoading(false);
    }
  };

  const navigate = (path: string) => () => {
    router.push(path as any);
  };

  if (loading)
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Sidebar loading={loading} handleLogout={handleLogout} />

        {/* Main Content Scrollable */}
        <ScrollView contentContainerStyle={styles.scrollMain}>
          <View style={styles.mainInner}>
            <Text style={styles.welcome}>Welcome back, {name || 'User'}!</Text>

            {/* Widget Grid */}
            <View style={styles.widgetsContainer}>
              {/* Expenses Summary Widget */}
              <TouchableOpacity
                style={styles.widgetBox}
                onPress={navigate('/(logged-in)/addexpense')}
              >
                <View style={styles.widgetHeader}>
                  <Text style={styles.widgetTitle}>Expenses Summary {currentMonth + 1}/{currentYear}</Text>
                  <FontAwesome name="bar-chart" size={20} color="#4a90e2" />
                </View>
                {(mapExists && <VictoryChart
                  theme={VictoryTheme.material}
                  domainPadding={{ x: 40 }}
                  height={160}
                  padding={{ top: 20, bottom: 40, left: 50, right: 20 }}
                >
                  <VictoryAxis
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        angle: -25,
                        padding: 10,
                        fill: '#444',
                      },
                      axis: { stroke: '#ccc' },
                      ticks: { stroke: '#ccc' },
                    }}
                  />
                  <VictoryAxis
                    dependentAxis
                    tickFormat={(t, i) => (i % 2 === 0 ? `$${t}` : '')}
                    style={{
                      tickLabels: {
                        fontSize: 10,
                        fill: '#444',
                      },
                      axis: { stroke: '#ccc' },
                      ticks: { stroke: '#ccc' },
                      grid: { stroke: '#eee', strokeDasharray: '4' },
                    }}
                  />
                  <VictoryBar
                    data={summary}
                    labels={({ datum }) => `$${datum.y.toFixed()}`}
                    animate={{ duration: 800, easing: 'bounce' }}
                    cornerRadius={6}
                    style={{
                      data: {
                        fill: '#71c193',
                        width: summary.length <= 4 ? 35 : 20,
                      },
                      labels: {
                        fontSize: 10,
                        fill: '#333',
                        padding: 4,
                      },
                    }}
                  />
                </VictoryChart>)}
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

            {/* Progress Section */}
            <View style={styles.progressContainer}>
            <Text style={styles.progressTitle}>Your Progress</Text>
            <LottieView
              source={require('../../assets/progress.json')}
              progress={Math.min(currentAmount / goalAmount, 1)}
              style={styles.progressImage}
            />
          </View>

          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f5f5f5' },
  container: { flex: 1, flexDirection: 'row' },

  scrollMain: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  mainInner: {
    flex: 1,
    padding: 30,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  welcome: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
    marginLeft: 20,
    marginTop: 30,
  },

  widgetsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },

  widgetBox: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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

  progressContainer: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '50%',
    height: '40%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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