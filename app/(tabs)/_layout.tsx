import { AppColors } from '@/constants/theme';
import { Tabs } from 'expo-router';
import { LayoutList, PieChart, User } from 'lucide-react-native';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: AppColors.primary.main,
        tabBarInactiveTintColor: AppColors.text.muted,
        headerShown: false,
        animation: 'fade',
        tabBarStyle: {
          backgroundColor: AppColors.background.secondary,
          borderTopWidth: 0,
          elevation: 0,
          height: 60,
          paddingBottom: 10,
        },
        sceneStyle: {
          backgroundColor: AppColors.background.primary,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Lists',
          tabBarIcon: ({ color }) => <LayoutList size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Budget',
          tabBarIcon: ({ color }) => <PieChart size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
