import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
  fetchRecords,
  setSearch,
  toggleFilter,
} from '../../redux/recordsSlice';
import { HealthRecord, RecordType } from '../../types/records';
import RecordCard from '../../components/RecordCard';

const FILTER_OPTIONS: { label: string; value: RecordType | 'all' }[] = [
  { label: 'All', value: 'all' },
  { label: '🔬 Lab', value: 'lab_report' },
  { label: '💊 Rx', value: 'prescription' },
  { label: '🩺 Consult', value: 'consultation' },
  { label: '💉 Vaccine', value: 'vaccination' },
  { label: '🤧 Allergy', value: 'allergy' },
];

const HealthRecordsScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const { items, status, searchQuery, activeFilters } = useAppSelector(
    state => state.records,
  );

  useEffect(() => {
    if (status === 'idle') dispatch(fetchRecords());
  }, [dispatch, status]);

  // 1. Filter records based on search and active filters
  const filteredRecords = useMemo(() => {
    return items.filter(record => {
      const matchesSearch =
        record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        record.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (record.doctorName &&
          record.doctorName.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter =
        activeFilters.length === 0 || activeFilters.includes(record.type);
      return matchesSearch && matchesFilter;
    });
  }, [items, searchQuery, activeFilters]);

  // 2. Group records by Month/Year
  const timelineSections = useMemo(() => {
    const sorted = [...filteredRecords].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
    const grouped: Record<string, HealthRecord[]> = {};

    sorted.forEach(record => {
      const date = new Date(record.date);
      const key = `${date.toLocaleString('default', {
        month: 'long',
      })} ${date.getFullYear()}`;
      if (!grouped[key]) grouped[key] = [];
      grouped[key].push(record);
    });

    return Object.keys(grouped).map(key => ({
      title: key,
      data: grouped[key],
    }));
  }, [filteredRecords]);

  // 3. FLATTEN THE DATA for FlatList (Inject headers directly into the data array)
  const flatListData = useMemo(() => {
    return timelineSections.flatMap(section => [
      // Inject a header object
      { id: `header-${section.title}`, type: 'header', title: section.title },
      // Spread the actual records
      ...section.data,
    ]);
  }, [timelineSections]);

  const handleFilter = (value: RecordType | 'all') => {
    if (value === 'all') {
      activeFilters.forEach(f => dispatch(toggleFilter(f)));
    } else {
      dispatch(toggleFilter(value));
    }
  };

  return (
    <View style={styles.container}>
      {/* SEARCH BAR */}
      <TextInput
        style={styles.search}
        placeholder="Search records, doctors, tags..."
        value={searchQuery}
        onChangeText={text => dispatch(setSearch(text))}
        placeholderTextColor="#888"
      />

      {/* HORIZONTAL FILTER CHIPS */}
      <View style={styles.filtersContainer}>
        <FlatList
          data={FILTER_OPTIONS}
          horizontal
          keyExtractor={item => item.value}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => {
            const isActive =
              item.value === 'all'
                ? activeFilters.length === 0
                : activeFilters.includes(item.value as RecordType);

            return (
              <TouchableOpacity
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => handleFilter(item.value)}
              >
                <Text
                  style={[
                    styles.filterText,
                    isActive && styles.filterTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {status === 'loading' ? (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={{ marginTop: 50 }}
        />
      ) : (
        <FlatList
          data={flatListData}
          keyExtractor={item => item.id}
          renderItem={({ item }: any) => {
            if (item.type === 'header') {
              return (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{item.title}</Text>
                  <View style={styles.timelineDot} />
                  <View style={styles.timelineLine} />
                </View>
              );
            }

            // Otherwise, render the standard record card
            return <RecordCard record={item} />;
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 15 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📁</Text>
              <Text style={styles.emptyText}>No records found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA', paddingTop: 50 },
  search: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    fontSize: 15,
    marginHorizontal: 15,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  filtersContainer: { marginBottom: 20, height: 40, paddingHorizontal: 15 },
  filterChip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    elevation: 1,
  },
  filterChipActive: { backgroundColor: '#007BFF' },
  filterText: { color: '#666', fontWeight: '600', fontSize: 13 },
  filterTextActive: { color: '#fff' },

  // Timeline Styles
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    backgroundColor: '#F5F7FA',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007BFF',
  },
  timelineLine: { flex: 1, height: 2, backgroundColor: '#E0E0E0' },

  // Empty State
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyIcon: { fontSize: 40, marginBottom: 10 },
  emptyText: { color: '#888', fontSize: 16 },
});

export default HealthRecordsScreen;
