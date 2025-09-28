import { Stack } from "expo-router";

const AuthLayout = () => {
 return (
  <Stack>
   <Stack.Screen
    name="login"
    options={{
     title: "Iniciar Sesion",
     headerShown: false,
    }}
   />
  </Stack>
 );
}

export default AuthLayout;