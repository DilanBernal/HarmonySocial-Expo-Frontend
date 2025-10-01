import defaultColors from '@/assets/styles/colors/default';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CreatePostScreen from './(tabs)/(post)/create-post';
import FeedScreen from './(tabs)/feed';
import LibraryScreen from './(tabs)/library';
import ProfileScreen from './(tabs)/profile';
import SearchScreen from './(tabs)/search/search-screen';

const Tab = createBottomTabNavigator();

const MainLayout = () => {
  return (
    <Tab.Navigator
      initialRouteName="feed"
      screenOptions={({ route }) => ({
        sceneStyle: {
          backgroundColor: defaultColors.background,
        },
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 2,
          elevation: 0,
          backgroundColor: '#111418',
          shadowColor: 'black',
          shadowOpacity: 0.1,
          shadowRadius: 5,
          shadowOffset: { width: 0, height: -3 },
        },
        tabBarBackground: () => null,
        tabBarActiveTintColor: '#7C4DFF',
        tabBarInactiveTintColor: '#9aa3b2',
      })}
    >
      <Tab.Screen
        name="feed"
        component={FeedScreen}
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
      <Tab.Screen
        name="search"
        component={SearchScreen}
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
      <Tab.Screen
        name="post"
        component={CreatePostScreen}
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

      <Tab.Screen
        name="library"
        component={LibraryScreen}
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

      <Tab.Screen
        name="profile"
        component={ProfileScreen}
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
    </Tab.Navigator>
  );
};

export default MainLayout;
