import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Doctor } from '../types';

interface Props {
  doctor: Doctor;
  onPress: () => void;
}

const DoctorCard: React.FC<Props> = ({ doctor, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{doctor.name.charAt(0)}</Text>
    </View>
    <View style={styles.info}>
      <Text style={styles.name}>{doctor.name}</Text>
      <Text style={styles.specialty}>{doctor.specialty}</Text>
      <Text style={styles.details}>⭐ {doctor.rating} | {doctor.experience}</Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: { flexDirection: 'row', padding: 15, backgroundColor: '#fff', marginBottom: 10, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41 },
  avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#007BFF', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1, justifyContent: 'center' },
  name: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  specialty: { fontSize: 14, color: '#666', marginTop: 2 },
  details: { fontSize: 12, color: '#888', marginTop: 4 }
});

export default DoctorCard;