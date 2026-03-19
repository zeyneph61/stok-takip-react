import { Tabs } from 'expo-router';
import React from 'react';


import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="dashboard" // Ana sayfa dashboard seçildi
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="inventory" // Envanter sayfası inventory seçildi
        options={{
          title: "Inventory",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="stock-movements" // Stock movements sayfası stock-movements seçildi
        options={{
          title: "Stock Movements",
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="arrow.up.arrow.down" color={color} />,
        }}
      />
    </Tabs>
  );
}
