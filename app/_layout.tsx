import defaultColors from "@/assets/styles/colors/default";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function RootLayout() {
 const colorScheme = useColorScheme();
 const insets = useSafeAreaInsets();

 return (
  <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
   <Stack
    initialRouteName="main"
    screenOptions={{
     contentStyle: {
      paddingTop: insets.top,
      backgroundColor: defaultColors.background,
     },
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
   <StatusBar style="light" />
  </ThemeProvider>
 );
}
