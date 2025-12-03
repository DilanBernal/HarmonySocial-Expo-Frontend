import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack, useNavigationContainerRef } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;
  const navigationRef = useNavigationContainerRef();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (navigationRef?.current) {
      setIsReady(true);
    }
  }, [navigationRef]);

  if (!isReady) {
    return <ActivityIndicator />
  }

  return (
    <ThemeProvider value={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Stack
          initialRouteName="auth"
          screenOptions={{
            headerShown: false,
            contentStyle: {
              marginTop: insets.top * 1.2,
              backgroundColor: 'transparent',
            },
            headerStyle: {
              backgroundColor: theme.colors.background,
            },
            animation: 'fade',
          }}
        >
          <Stack.Screen
            name="auth"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
        <StatusBar style="light" backgroundColor="#8400ffff" />
      </View>
    </ThemeProvider>
  );
}
