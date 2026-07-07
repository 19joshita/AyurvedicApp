import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addToCart } from '../../redux/cartSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';

type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Wishlist: undefined;
};

type Props = { navigation: NativeStackNavigationProp<ShopStackParamList, 'Wishlist'> };

const WishlistScreen: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.wishlist);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Wishlist</Text>
      {items.length === 0 ? <Text style={styles.empty}>No items wishlisted.</Text> : (
        <FlatList data={items} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
            <View style={styles.info}>
              <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
              <Text style={styles.price}>${item.price.toFixed(2)}</Text>
              <View style={styles.actions}>
                <TouchableOpacity style={styles.btn} onPress={() => { dispatch(addToCart(item)); Alert.alert('Added to Cart'); }}>
                  <Text style={styles.btnText}>Add to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => dispatch(toggleWishlist(item))}>
                  <Text style={styles.removeText}>Remove</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  empty: { textAlign: 'center', color: '#888', marginTop: 50 },
  card: { flexDirection: 'row', backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 1 },
  image: { width: 80, height: 80, marginRight: 15 },
  info: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 14, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#007BFF', marginVertical: 5 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  btn: { backgroundColor: '#007BFF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5 },
  btnText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  removeText: { color: 'red', fontSize: 12 }
});

export default WishlistScreen;