import { Tabs } from 'expo-router';
import React from 'react';
import { Text, useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#007AFF',
        headerShown: true,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'New App',
          tabBarIcon: () => <Text style={{color: '#ccc'}}>tabtab</Text>, 
        }}
      />
    </Tabs>
  );
}