import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ConsultationTab from './tabs/ConsultationTab';
import ShopTab from './tabs/ShopTab';
import { Text } from 'react-native';
import HealthRecordsTab from './tabs/HealthRecordsTab';

const Tab = createBottomTabNavigator();

const AppNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false, // Headers are handled by inner stacks
      tabBarIcon: ({ focused, color, size }) => {
        let icon = '';
        if (route.name === 'Consult') icon = '🩺';
        if (route.name === 'Shop') icon = '🛍️';
        if (route.name === 'Records') icon = '📁';

        return <Text style={{ fontSize: size, color }}>{icon}</Text>;
      },
      tabBarActiveTintColor: '#007BFF',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="Consult" component={ConsultationTab} />
    <Tab.Screen name="Shop" component={ShopTab} />
    <Tab.Screen name="Records" component={HealthRecordsTab} />
  </Tab.Navigator>
);

export default AppNavigator;
