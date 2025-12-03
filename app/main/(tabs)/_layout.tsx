import defaultColors from '@/assets/styles/colors/default';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';


const MainLayout = () => {
  return (
    <Tabs

      screenOptions={() => ({
        sceneStyle: {
          backgroundColor: defaultColors.background,
        },
        headerShown: false,
        headerStyle: { backgroundColor: 'blue', height: 0 },
        tabBarBackground: () => null,
        tabBarActiveTintColor: '#7C4DFF',
        tabBarInactiveTintColor: '#9aa3b2',
      })}
    >
      <Tabs.Screen
        name="feed"
        options={{
          headerShown: false,
          title: 'Feed',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={!focused ? 'home-outline' : 'home'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          headerShown: false,
          title: 'Busqueda',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={!focused ? 'search-outline' : 'search'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(post)/create-post"
        options={{
          title: 'Crear nuevo post',
          tabBarIcon({ color, size, focused }) {
            return (
              <Ionicons
                name={!focused ? 'add-circle-outline' : 'add-circle'}
                size={size}
                color={color}
              />
            );
          },
        }}
      />


      <Tabs.Screen
        name="library"
        options={{
          headerShown: false,
          title: 'Library',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={!focused ? 'albums-outline' : 'albums'}
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          title: 'Profile',
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={!focused ? 'person-outline' : 'person'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default MainLayout;
