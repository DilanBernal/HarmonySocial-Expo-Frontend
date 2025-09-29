import defaultColors from "@/assets/styles/colors/default";
import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text, View } from "react-native";

const Tab = createBottomTabNavigator();

const MainLayout = () => {
 return (
  <Tab.Navigator
   initialRouteName="home"
   screenOptions={({ route }) => ({
    sceneStyle: {
     backgroundColor: defaultColors.background,
    },
    headerShown: false,
    tabBarStyle: {
     backgroundColor: "#111418",
     borderColor: "#004cffff",
     borderTopWidth: 2,
     borderLeftWidth: 2,
     borderRightWidth: 2,
     borderTopLeftRadius: 100,
     borderTopRightRadius: 100,
    },
    tabBarActiveTintColor: "#7C4DFF",
    tabBarInactiveTintColor: "#9aa3b2",
    tabBarIcon: ({ color, size, focused }) => {
     const map: Record<string, string> = {
      Feed: focused ? "home" : "home-outline",
      home: focused ? "home" : "home-outline",
      Buscar: focused ? "Buscar" : "Buscar-outline",
      Subir: focused ? "add-circle" : "add-circle-outline", // ⬅️
      Library: focused ? "musical-notes" : "musical-notes-outline",
      Profile: focused ? "person" : "person-outline",
     };
     return (
      <Ionicons name={map[route.name] as any} size={size} color={color} />
     );
    },
   })}
  >
   <Tab.Screen
    name="home"
    component={tempComponent}
    options={{ headerShown: false }}
   />
   <Tab.Screen name="home2" component={tempComponent2} />
  </Tab.Navigator>
 );
};

const tempComponent = () => (
 <View>
  <Text>lsdkfjsdlf</Text>
 </View>
);

const tempComponent2 = () => (
 <View>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
  <Text>lsdkfjsdlf</Text>
 </View>
);

export default MainLayout;
