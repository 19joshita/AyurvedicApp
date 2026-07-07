import React, { useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { fetchSlots, clearSlots } from '../../redux/doctorsSlice';
import { bookSlot, clearError } from '../../redux/bookingsSlice';

import SlotCard from '../../components/SlotCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type RootStackParamList = {
  Home: undefined;
  Details: { doctorId: string; doctorName: string };
  Bookings: undefined;
};

type DetailsScreenRouteProp = RouteProp<RootStackParamList, 'Details'>;
type DetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Details'>;

interface Props {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
}

const DoctorDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const { doctorId, doctorName } = route.params;
  const dispatch = useAppDispatch();
  const { slots } = useAppSelector((state) => state.doctors);
  const { error } = useAppSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchSlots(doctorId));
    return () => { dispatch(clearSlots()); dispatch(clearError()); };
  }, [dispatch, doctorId]);

  useEffect(() => {
    if (error) {
      Alert.alert('Booking Error', error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleBook = async (slotId: string) => {
    try {
      await dispatch(bookSlot(slotId)).unwrap();
      Alert.alert('Success', 'Slot booked successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('Bookings') }
      ]);
      dispatch(fetchSlots(doctorId)); // Refresh slots to show updated status
    } catch (err) {
      // Error handled by useEffect above
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{doctorName}</Text>
      <Text style={styles.subHeader}>Available Slots</Text>
      <FlatList 
        data={slots} 
        keyExtractor={(item) => item.id} 
        renderItem={({ item }) => (
          <SlotCard slot={item} onBook={handleBook} />
        )} 
        contentContainerStyle={{ paddingBottom: 20 }} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 15 },
  header: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  subHeader: { fontSize: 16, color: '#666', marginBottom: 20 }
});

export default DoctorDetailsScreen;