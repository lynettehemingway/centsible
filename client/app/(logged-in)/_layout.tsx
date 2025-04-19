import { Stack, Redirect} from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useUserAuth } from '@/hooks/useUserAuth';

export default function Layout() {
  const { isAuthenticated } = useUserAuth();

  if (isAuthenticated === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }
  else if (isAuthenticated === false) {
    return <Redirect href="/login" />;
  }
  return <Stack screenOptions={{ headerShown: false }} />;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})