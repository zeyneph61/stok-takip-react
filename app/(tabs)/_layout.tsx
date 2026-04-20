import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#1573FE',
        tabBarInactiveTintColor: '#7B8AA6',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: 'transparent',
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'view-dashboard' : 'view-dashboard-outline'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inventory"
        options={{
          title: 'Inventory',
          tabBarLabel: 'Inventory',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'package-variant-closed' : 'package-variant'}
              size={size}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="stock-movements"
        options={{
          title: 'Stock Movements',
          tabBarLabel: 'Movements',
          tabBarIcon: ({ color, size, focused }) => (
            <MaterialCommunityIcons
              name={focused ? 'swap-horizontal-bold' : 'swap-horizontal'}
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
