import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { removeFromCart, updateQuantity } from '../../redux/cartSlice';

type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

type Props = { navigation: NativeStackNavigationProp<ShopStackParamList, 'Cart'> };

const CartScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Cart ({items.length})</Text>
      <FlatList data={items} keyExtractor={item => item.id.toString()} renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))} style={styles.qtyBtn}><Text>-</Text></TouchableOpacity>
            <Text style={styles.qty}>{item.quantity}</Text>
            <TouchableOpacity onPress={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))} style={styles.qtyBtn}><Text>+</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => dispatch(removeFromCart(item.id))} style={styles.removeBtn}><Text style={{color:'red'}}>Remove</Text></TouchableOpacity>
          </View>
        </View>
      )} />
      
      {items.length > 0 && (
        <View style={styles.footer}>
          <Text style={styles.totalText}>Total: ${total.toFixed(2)}</Text>
          <TouchableOpacity style={styles.checkoutBtn} onPress={() => navigation.navigate('Checkout')}>
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 50, paddingHorizontal: 15 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginBottom: 10, elevation: 1 },
  title: { fontSize: 14, fontWeight: 'bold' },
  price: { fontSize: 16, color: '#007BFF', marginVertical: 5 },
  qtyRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  qtyBtn: { width: 30, height: 30, backgroundColor: '#eee', borderRadius: 5, alignItems: 'center', justifyContent: 'center' },
  qty: { fontSize: 16, fontWeight: 'bold' },
  removeBtn: { marginLeft: 'auto' },
  footer: { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#eee' },
  totalText: { fontSize: 20, fontWeight: 'bold', marginBottom: 15 },
  checkoutBtn: { backgroundColor: '#28a745', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});

export default CartScreen;