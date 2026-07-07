import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';

import { clearCart } from '../../redux/cartSlice';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';

type ShopStackParamList = {
  ProductList: undefined;
  ProductDetails: { productId: number };
  Cart: undefined;
  Checkout: undefined;
  Wishlist: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<ShopStackParamList, 'Checkout'>;
};

const CheckoutScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(state => state.cart);

  // Local UI State
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Pricing Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 50 ? 0 : 10.0;
  const discount = appliedPromo === 'SAVE5' ? 5.0 : 0.0;
  const total = subtotal + shipping - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'SAVE5') {
      setAppliedPromo('SAVE5');
      Alert.alert('Promo Applied', '$5.00 discount added!');
    } else {
      Alert.alert('Invalid Code', 'Try using "SAVE5" for a $5 discount.');
    }
  };

  const handlePlaceOrder = () => {
    dispatch(clearCart());
    Alert.alert(
      'Order Placed Successfully! 🎉',
      'Your health products will be delivered to your address shortly.',
      [
        {
          text: 'Continue Shopping',
          onPress: () =>
            navigation.reset({ index: 0, routes: [{ name: 'ProductList' }] }),
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={true}>
        {/* --- DELIVERY ADDRESS SECTION --- */}
        <SectionTitle title="Deliver To" />
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.boldText}>Home</Text>
              <Text style={styles.subText}>
                423 Health Street, Medical District
              </Text>
              <Text style={styles.subText}>New York, NY 10001</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeText}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- ORDER ITEMS SECTION --- */}
        <SectionTitle title={`Order Summary (${items.length} Items)`} />
        <View style={styles.card}>
          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.itemMeta}>Qty: {item.quantity}</Text>
              </View>
              <Text style={styles.itemPrice}>
                ${(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* --- PROMO CODE SECTION --- */}
        <SectionTitle title="Promo Code" />
        <View style={styles.promoContainer}>
          <TextInput
            style={styles.promoInput}
            placeholder="Enter code (e.g., SAVE5)"
            value={promoCode}
            onChangeText={setPromoCode}
            autoCapitalize="characters"
          />
          <TouchableOpacity style={styles.promoBtn} onPress={handleApplyPromo}>
            <Text style={styles.promoBtnText}>Apply</Text>
          </TouchableOpacity>
        </View>

        {/* --- PAYMENT DETAILS SECTION --- */}
        <SectionTitle title="Payment Details" />
        <View style={styles.card}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Subtotal</Text>
            <Text style={styles.detailValue}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Shipping</Text>
            <Text
              style={[styles.detailValue, shipping === 0 && styles.freeText]}
            >
              {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
            </Text>
          </View>
          {discount > 0 && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Discount</Text>
              <Text style={[styles.detailValue, styles.discountText]}>
                -${discount.toFixed(2)}
              </Text>
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>

        {/* --- PAYMENT METHOD SECTION --- */}
        <SectionTitle title="Payment Method" />
        <View style={styles.card}>
          <PaymentOption
            title="Credit / Debit Card"
            subtitle="**** **** **** 4242"
            icon="💳"
            isSelected={paymentMethod === 'card'}
            onPress={() => setPaymentMethod('card')}
          />
          <View style={styles.smallDivider} />
          <PaymentOption
            title="PayPal"
            subtitle="user@email.com"
            icon="🅿️"
            isSelected={paymentMethod === 'paypal'}
            onPress={() => setPaymentMethod('paypal')}
          />
          <View style={styles.smallDivider} />
          <PaymentOption
            title="Cash on Delivery"
            subtitle="Pay when you receive"
            icon="💵"
            isSelected={paymentMethod === 'cod'}
            onPress={() => setPaymentMethod('cod')}
          />
        </View>

        {/* Bottom spacing for the fixed button */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* --- FIXED BOTTOM CHECKOUT BUTTON --- */}
      <View style={styles.footer}>
        <View style={styles.footerTotal}>
          <Text style={styles.footerTotalLabel}>Total:</Text>
          <Text style={styles.footerTotalPrice}>${total.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.payBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.8}
        >
          <Text style={styles.payBtnText}>Place Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// --- REUSABLE SUB-COMPONENTS ---

const SectionTitle: React.FC<{ title: string }> = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const PaymentOption: React.FC<{
  title: string;
  subtitle: string;
  icon: string;
  isSelected: boolean;
  onPress: () => void;
}> = ({ title, subtitle, icon, isSelected, onPress }) => (
  <TouchableOpacity
    style={styles.paymentRow}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={styles.paymentIcon}>{icon}</Text>
    <View style={{ flex: 1, marginLeft: 10 }}>
      <Text style={styles.boldText}>{title}</Text>
      <Text style={styles.subText}>{subtitle}</Text>
    </View>
    <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
      {isSelected && <View style={styles.radioInner} />}
    </View>
  </TouchableOpacity>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },

  // Section Titles
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
  },

  // Cards
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },

  // Address & Items
  row: { flexDirection: 'row', alignItems: 'center' },
  boldText: { fontSize: 15, fontWeight: '600', color: '#222' },
  subText: { fontSize: 13, color: '#666', marginTop: 2 },
  changeText: { fontSize: 13, color: '#007BFF', fontWeight: '600' },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  itemName: { fontSize: 14, color: '#333', fontWeight: '500', marginRight: 10 },
  itemMeta: { fontSize: 12, color: '#888', marginTop: 2 },
  itemPrice: { fontSize: 14, fontWeight: '700', color: '#333' },

  // Promo Code
  promoContainer: {
    flexDirection: 'row',
    marginHorizontal: 15,
    marginBottom: 10,
  },
  promoInput: {
    flex: 1,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 14,
  },
  promoBtn: {
    backgroundColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    marginLeft: 10,
  },
  promoBtnText: { color: '#FFF', fontWeight: '700', fontSize: 14 },

  // Payment Details
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: { fontSize: 14, color: '#666' },
  detailValue: { fontSize: 14, color: '#333', fontWeight: '500' },
  freeText: { color: '#28a745', fontWeight: '700' },
  discountText: { color: '#ff4d4f', fontWeight: '700' },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 5 },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  totalLabel: { fontSize: 17, fontWeight: '700', color: '#222' },
  totalValue: { fontSize: 17, fontWeight: '800', color: '#007BFF' },

  // Payment Methods
  paymentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  paymentIcon: { fontSize: 24 },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#CCC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: { borderColor: '#007BFF' },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007BFF',
  },
  smallDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 5 },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 10,
  },
  footerTotal: { flex: 1 },
  footerTotalLabel: { fontSize: 14, color: '#666' },
  footerTotalPrice: { fontSize: 20, fontWeight: '800', color: '#222' },
  payBtn: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  payBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});

export default CheckoutScreen;
