import { NavigationContainer } from "@react-navigation/native"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { View, Text } from 'react-native';

const Tab = createBottomTabNavigator();

const MainLayout = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen>
          <View><Text>lksdjflsk</Text></View>
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default MainLayout;