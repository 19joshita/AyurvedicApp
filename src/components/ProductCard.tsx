import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Product } from '../types/shop';

interface Props {
  product: Product;
  onPress: () => void;
  isWishlisted: boolean;
  onToggleWishlist: () => void;
}

const ProductCard: React.FC<Props> = ({
  product,
  onPress,
  isWishlisted,
  onToggleWishlist,
}) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image
      source={{ uri: product.image }}
      style={styles.image}
      resizeMode="contain"
    />
    <View style={styles.info}>
      <Text style={styles.title} numberOfLines={2}>
        {product.title}
      </Text>
      <Text style={styles.category}>{product.category}</Text>
      <View style={styles.bottomRow}>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        <TouchableOpacity onPress={onToggleWishlist}>
          <Text style={[styles.wishBtn, isWishlisted && styles.wishBtnActive]}>
            {isWishlisted ? '❤️' : '🤍'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    margin: 8,
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  image: { width: '100%', height: 120, marginBottom: 10 },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  category: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: { fontSize: 16, fontWeight: 'bold', color: '#007BFF' },
  wishBtn: { fontSize: 22 },
  wishBtnActive: {},
});

export default ProductCard;
