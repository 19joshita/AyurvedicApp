import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { fetchDoctors } from '../../redux/doctorsSlice';

import DoctorCard from '../../components/DoctorCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type RootStackParamList = {
  Home: undefined;
  Details: { doctorId: string; doctorName: string };
  Bookings: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Home'
>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { list, status } = useAppSelector(state => state.doctors);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    dispatch(fetchDoctors());
  }, [dispatch]);

  const specialties = [
    'All',
    ...Array.from(new Set(list.map(d => d.specialty))),
  ];

  const filteredDoctors = list?.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || doc.specialty === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Find Your Doctor</Text>
      <TextInput
        style={styles.search}
        placeholder="Search doctors..."
        value={search}
        onChangeText={setSearch}
        placeholderTextColor={"gray"}
      />

      <View style={styles.filterContainer}>
        <FlatList
          data={specialties}
          horizontal
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterBtn, filter === item && styles.activeFilter]}
              onPress={() => setFilter(item)}
            >
              <Text
                style={[
                  styles.filterText,
                  filter === item && styles.activeFilterText,
                ]}
              >
                {item}
              </Text>
            </TouchableOpacity>
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      {status === 'loading' ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading...</Text>
      ) : (
        <FlatList
          data={filteredDoctors}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <DoctorCard
              doctor={item}
              onPress={() =>
                navigation.navigate('Details', {
                  doctorId: item.id,
                  doctorName: item.name,
                })
              }
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 15, color: '#333' },
  search: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    elevation: 1,
  },
  filterContainer: { marginBottom: 15, height: 40 },
  filterBtn: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    elevation: 1,
  },
  activeFilter: { backgroundColor: '#007BFF' },
  filterText: { color: '#666', fontWeight: '600' },
  activeFilterText: { color: '#fff' },
});

export default HomeScreen;
