import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const theme = colorScheme === 'dark' ? DarkTheme : DefaultTheme;

  return (
    <ThemeProvider value={theme}>
      <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
        <Stack
          initialRouteName="auth"
          screenOptions={{
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
          <Stack.Screen name="main" options={{ headerShown: false }} />
        </Stack>
        <StatusBar style="light" backgroundColor="#8400ffff" />
      </View>
    </ThemeProvider>
  );
}
