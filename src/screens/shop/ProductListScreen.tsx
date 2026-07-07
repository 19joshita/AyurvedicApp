import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import {
  applyFilters,
  fetchCategories,
  fetchProducts,
  loadMore,
  setCategory,
  setSearch,
  setSortOrder,
} from '../../redux/productsSlice';
import ProductCard from '../../components/ProductCard';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Wishlist: undefined; // Added this
};

type Props = {
  navigation: NativeStackNavigationProp<ShopStackParamList, 'ProductList'>;
};

const ProductListScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const {
    displayedItems,
    categories,
    status,
    hasMore,
    searchQuery,
    activeCategory,
    sortOrder,
  } = useAppSelector(state => state.products);
  const wishlistItems = useAppSelector(state => state.wishlist.items);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSearch = (text: string) => {
    dispatch(setSearch(text));
    dispatch(applyFilters());
  };

  const handleFilter = (cat: string) => {
    dispatch(setCategory(cat));
    dispatch(applyFilters());
  };

  const handleSort = () => {
    dispatch(setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc'));
    dispatch(applyFilters());
  };

  const handleLoadMore = async () => {
    if (hasMore && !isLoadingMore) {
      setIsLoadingMore(true);
      // Small timeout to simulate network delay for the loading spinner to show
      setTimeout(() => {
        dispatch(loadMore());
        setIsLoadingMore(false);
      }, 500);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <TextInput
          style={styles.search}
          placeholder="Search products..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Wishlist')}
        >
          <Text style={styles.headerIcon}>❤️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.headerIcon}>🛒</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filterRow}>
        <TouchableOpacity style={styles.sortBtn} onPress={handleSort}>
          <Text style={styles.sortText}>
            Price: {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.filterToggle}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.sortText}>Filters {showFilters ? '▲' : '▼'}</Text>
        </TouchableOpacity>
      </View>

      {showFilters && (
        <View style={styles.chipsContainer}>
          <FlatList
            data={categories}
            horizontal
            keyExtractor={item => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.chip,
                  activeCategory === item && styles.chipActive,
                ]}
                onPress={() => handleFilter(item)}
              >
                <Text
                  style={[
                    styles.chipText,
                    activeCategory === item && styles.chipTextActive,
                  ]}
                >
                  {item}
                </Text>
              </TouchableOpacity>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {status === 'loading' ? (
        <Text style={styles.centerText}>Loading Products...</Text>
      ) : (
        <FlatList
          data={displayedItems}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          // ADDED: Footer to show loading spinner during infinite scroll
          ListFooterComponent={() => {
            if (!isLoadingMore) return null;
            return (
              <View style={{ paddingVertical: 20 }}>
                <ActivityIndicator size="large" color="#007BFF" />
              </View>
            );
          }}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              isWishlisted={wishlistItems.some(w => w.id === item.id)}
              onToggleWishlist={() =>
                dispatch({ type: 'wishlist/toggleWishlist', payload: item })
              }
              onPress={() =>
                navigation.navigate('ProductDetails', { productId: item.id })
              }
            />
          )}
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
    paddingHorizontal: 10,
  },
  headerRow: { flexDirection: 'row', marginBottom: 10, alignItems: 'center' },
  search: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    elevation: 1,
    marginRight: 8,
  },
  iconBtn: {
    backgroundColor: '#fff',
    width: 44,
    height: 44,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  headerIcon: { fontSize: 20 },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  sortBtn: {
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  sortText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  filterToggle: {
    backgroundColor: '#333',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipsContainer: { marginBottom: 10, height: 40 },
  chip: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginRight: 10,
    justifyContent: 'center',
    elevation: 1,
  },
  chipActive: { backgroundColor: '#007BFF' },
  chipText: { color: '#333', fontWeight: '600', textTransform: 'capitalize' },
  chipTextActive: { color: '#fff' },
  centerText: { textAlign: 'center', marginTop: 50 },
});

export default ProductListScreen;
