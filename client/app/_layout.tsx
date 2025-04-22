import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';

export default function Layout() {
  const [fontsLoaded] = useFonts({
    'SpaceMono': require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  return <Stack screenOptions={{ headerShown: false }} />;

}