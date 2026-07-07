import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../../screens/consultant/HomeScreen';
import { Text, TouchableOpacity } from 'react-native';
import DoctorDetailsScreen from '../../screens/consultant/DoctorDetailsScreen';
import UpcomingBookingsScreen from '../../screens/consultant/UpcomingBookingsScreen';


export type ConsultationStackParamList = {
  Home: undefined;
  Details: { doctorId: string; doctorName: string };
  Bookings: undefined;
};

const Stack = createNativeStackNavigator<ConsultationStackParamList>();

const ConsultationTab = () => (
  <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <Stack.Screen 
      name="Home" 
      component={HomeScreen} 
      options={({ navigation }) => ({
        title: 'Consultations',
        headerRight: () => (
          <TouchableOpacity onPress={() => navigation.navigate('Bookings')}>
            <Text style={{ color: '#007BFF', fontWeight: 'bold' }}>My Bookings</Text>
          </TouchableOpacity>
        ),
      })}
    />
    <Stack.Screen name="Details" component={DoctorDetailsScreen} options={{ title: 'Doctor Details' }} />
    <Stack.Screen name="Bookings" component={UpcomingBookingsScreen} options={{ title: 'My Bookings' }} />
  </Stack.Navigator>
);

export default ConsultationTab;