import React, { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { Product } from '../../types/shop';
import { shopApi } from '../../api/axiosInstance';
import { addToCart } from '../../redux/cartSlice';
import { toggleWishlist } from '../../redux/wishlistSlice';


type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Wishlist: undefined;
};

type Props = {
  route: any
};

const ProductDetailsScreen: React.FC<Props> = ({ route }) => {
  const { productId } = route.params;
  const dispatch = useAppDispatch();
  const isWishlisted = useAppSelector(state => state.wishlist.items.some(i => i.id === productId));
  const [product, setProduct] = React.useState<Product | null>(null);

  useEffect(() => {
    shopApi.get(`/products/${productId}`).then(res => setProduct(res.data));
  }, [productId]);

  if (!product) return <View style={styles.center}><Text>Loading...</Text></View>;

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="contain" />
      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.title}>{product.title}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.rating}>⭐ {product.rating.rate} ({product.rating.count} reviews)</Text>
      <Text style={styles.description}>{product.description}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.cartBtn} onPress={() => { dispatch(addToCart(product)); Alert.alert('Added to Cart'); }}>
          <Text style={styles.btnText}>Add to Cart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.cartBtn, isWishlisted && styles.wishBtnActive]} onPress={() => dispatch(toggleWishlist(product))}>
          <Text style={styles.btnText}>{isWishlisted ? '❤️ Wishlisted' : '🤍 Wishlist'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 50 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: '100%', height: 300, marginBottom: 20 },
  category: { color: '#888', textTransform: 'capitalize', marginBottom: 5 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#007BFF', marginBottom: 10 },
  rating: { fontSize: 14, color: '#666', marginBottom: 20 },
  description: { fontSize: 14, color: '#555', lineHeight: 22, flex: 1 },
  actions: { flexDirection: 'row', gap: 15, marginTop: 20 },
  cartBtn: { flex: 1, backgroundColor: '#007BFF', padding: 15, borderRadius: 10, alignItems: 'center' },
  wishBtnActive: { backgroundColor: '#ff4d4f' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});

export default ProductDetailsScreen;