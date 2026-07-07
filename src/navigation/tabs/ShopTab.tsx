import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../../screens/shop/ProductListScreen';
import ProductDetailsScreen from '../../screens/shop/ProductDetailsScreen';
import CartScreen from '../../screens/shop/CartScreen';
import CheckoutScreen from '../../screens/shop/CheckoutScreen';
import WishlistScreen from '../../screens/shop/WishlistScreen';

export type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

const Stack = createNativeStackNavigator<ShopStackParamList>();

const ShopTab = () => (
  <Stack.Navigator screenOptions={{ headerShadowVisible: false }}>
    <Stack.Screen name="ProductList" component={ProductListScreen} options={{ title: 'Health Shop' }} />
    <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} options={{ title: 'Product Details' }} />
    <Stack.Screen name="Cart" component={CartScreen} options={{ title: 'My Cart' }} />
    <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Checkout' }} />
    <Stack.Screen name="Wishlist" component={WishlistScreen} options={{ title: 'My Wishlist' }} />
  </Stack.Navigator>
);

export default ShopTab;