import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Slot } from '../types';

interface Props {
  slot: Slot;
  onBook: (id: string) => void;
}

const SlotCard: React.FC<Props> = ({ slot, onBook }) => {
  const date = new Date(slot.time);
  const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isExpired = new Date(slot.time) < new Date();
  const isDisabled = isExpired || slot.isBooked;

  let statusText = 'Book Now';
  let bgColor = '#007BFF';
  if (isExpired) { statusText = 'Expired'; bgColor = '#ccc'; }
  if (slot.isBooked) { statusText = 'Booked'; bgColor = '#ff4d4f'; }

  return (
    <TouchableOpacity 
      style={[styles.card, isDisabled && styles.disabledCard]} 
      onPress={() => !isDisabled && onBook(slot.id)}
      disabled={isDisabled}
    >
      <Text style={styles.time}>{timeStr}</Text>
      <View style={[styles.btn, { backgroundColor: bgColor }]}>
        <Text style={styles.btnText}>{statusText}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  disabledCard: { opacity: 0.6 },
  time: { fontSize: 16, fontWeight: '500', color: '#333' },
  btn: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20 },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 12 }
});

export default SlotCard;