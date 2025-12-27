import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider, ItemsProvider, ListsProvider } from '@/contexts';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom dark theme matching our design
const ShopeeTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: '#22C55E',
    background: '#0F0F0F',
    card: '#1A1A1A',
    text: '#FFFFFF',
    border: '#2E2E2E',
    notification: '#22C55E',
  },
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <ListsProvider>
        <ItemsProvider>
          <ThemeProvider value={colorScheme === 'dark' ? ShopeeTheme : DefaultTheme}>
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'fade',
                animationDuration: 200,
                contentStyle: { backgroundColor: ShopeeTheme.colors.background },
                gestureEnabled: true,
                gestureDirection: 'horizontal',
                fullScreenGestureEnabled: true,
              }}
            >
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen 
                name="list/[id]" 
                options={{ 
                  animation: 'slide_from_right',
                  animationDuration: 250,
                  gestureEnabled: true,
                  gestureDirection: 'horizontal',
                  fullScreenGestureEnabled: true,
                }} 
              />
              <Stack.Screen 
                name="modal" 
                options={{ 
                  presentation: 'modal', 
                  title: 'Modal',
                  animation: 'fade_from_bottom',
                }} 
              />
            </Stack>
            <StatusBar style="light" />
          </ThemeProvider>
        </ItemsProvider>
      </ListsProvider>
    </AuthProvider>
  );
}
