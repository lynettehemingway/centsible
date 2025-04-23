import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
type Props = {
    currentAmount: number;
    goalAmount: number;
  };

  export default function ProgressLottie({ currentAmount, goalAmount }: Props) {
    const progress = Math.min(currentAmount / goalAmount, 1); // clamp to 1

    return (
        <View style={styles.container}>
        <Text style={styles.title}>Your Progress</Text>
        <LottieView
            source={require('../../assets/lottie/levels.json')}
            progress={progress}
            style={styles.lottie}
        />
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '50%',
    minHeight: 180,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  lottie: {
    width: '100%',
    height: '100%',
  },
});
