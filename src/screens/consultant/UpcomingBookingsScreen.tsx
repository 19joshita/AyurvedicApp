import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { fetchBookings, cancelBooking } from '../../redux/bookingsSlice';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';


const UpcomingBookingsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list } = useAppSelector((state) => state.bookings);

  useEffect(() => { dispatch(fetchBookings()); }, [dispatch]);

  const handleCancel = (bookingId: string) => {
    Alert.alert('Cancel Booking', 'Are you sure you want to cancel this consultation?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => dispatch(cancelBooking(bookingId)) }
    ]);
  };

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Upcoming Consultations</Text>
      {list.length === 0 ? <Text style={styles.empty}>No upcoming bookings.</Text> : (
        <FlatList 
          data={list} 
          keyExtractor={(item) => item.id} 
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View>
                <Text style={styles.name}>{item.doctor?.name}</Text>
                <Text style={styles.specialty}>{item.doctor?.specialty}</Text>
                <Text style={styles.time}>📅 {formatTime(item.time)}</Text>
              </View>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => handleCancel(item.id)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )} 
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
  empty: { textAlign: 'center', color: '#888', marginTop: 50, fontSize: 16 },
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 2 },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  specialty: { fontSize: 14, color: '#666', marginTop: 2 },
  time: { fontSize: 12, color: '#888', marginTop: 4 },
  cancelBtn: { backgroundColor: '#fff0f0', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 5, borderWidth: 1, borderColor: '#ff4d4f' },
  cancelText: { color: '#ff4d4f', fontWeight: 'bold' }
});

export default UpcomingBookingsScreen;