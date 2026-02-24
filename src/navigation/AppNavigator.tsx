import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Thư viện icon xịn của Expo

// Import Types
import { RootStackParamList, BottomTabParamList } from '../types/navigation';

// Import Screens
import HomeScreen from '../screens/HomeScreen';
import FavoriteScreen from '../screens/Favorite/FavoriteScreen';
import DetailScreen from '../screens/Detail/DetailScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

// 1. Cấu hình Bottom Tabs
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // Hiển thị Header
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'home';
          if (route.name === 'Home') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Favorites') iconName = focused ? 'heart' : 'heart-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#e91e63', // Màu hồng hợp với app bán túi xách
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Handbags' }} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} options={{ title: 'My Favorites' }} />
    </Tab.Navigator>
  );
};

// 2. Cấu hình Root Stack (Bọc Tabs và Detail)
export const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* MainTabs không có header ở đây vì Tab.Navigator đã có header riêng */}
        <Stack.Screen name="MainTabs" component={MainTabs} />
        
        {/* Detail Screen sẽ đè lên trên Bottom Tabs */}
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{
            headerShown: true,
            title: 'Handbag Detail',
            presentation: 'card', // Hiệu ứng chuyển trang mượt mà
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};