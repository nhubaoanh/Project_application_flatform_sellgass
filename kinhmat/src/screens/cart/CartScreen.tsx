// src/screens/cart/CartScreen.tsx
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import { Button } from "@/src/components/ui/Button";
import Product from "@/src/types/product";
import React from "react";
import { Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartScreenProps {
  onBack: () => void;
  onCheckout: () => void;
  cartItems: CartItem[];
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onCheckout,
  cartItems = [],
  removeFromCart,
  updateQuantity,
  clearCart,
  totalItems = 0,
  totalPrice = 0,
}) => {
  const updateItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  const handleRemoveItem = (productId: number) => {
    Alert.alert(
      'Xác nhận',
      'Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: () => removeFromCart(productId),
        },
      ]
    );
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={onBack}
      >
        <Text style={styles.backIcon}>←</Text>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Giỏ hàng</Text>
      {cartItems.length > 0 && (
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearButton}>Xóa tất cả</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  const renderCartItem = (item: CartItem, index: number) => {
    const product = item.product;
    return (
      <View key={`${product.masp}-${index}`} style={styles.cartItem}>
        <Image 
          source={{ uri: product.hinhanh }} 
          style={styles.itemImage} 
          resizeMode="contain"
        />
        
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {product.tensp}
          </Text>
          
          <View style={styles.itemOptions}>
            <Text style={styles.itemOption}>
              Màu: {item.selectedColor}
            </Text>
            <Text style={styles.itemOption}>
              Kích thước: {item.selectedSize}
            </Text>
          </View>
          
          <Text style={styles.itemPrice}>
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.gia * item.quantity)}
          </Text>
        </View>
        
        <View style={styles.itemActions}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateItemQuantity(product.masp!, item.quantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            
            <Text style={styles.quantityText}>{item.quantity}</Text>
            
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => updateItemQuantity(product.masp!, item.quantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveItem(product.masp!)}
          >
            <Text style={styles.removeButtonText}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderEmptyCart = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>🛒</Text>
      <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
      <Text style={styles.emptyText}>Bạn chưa có sản phẩm nào trong giỏ hàng</Text>
      <Button
        title="Tiếp tục mua sắm"
        onPress={onBack}
        variant="primary"
        style={styles.continueShoppingButton}
      />
    </View>
  );

  const renderCartItems = () => (
    <ScrollView 
      style={styles.cartItemsContainer}
      showsVerticalScrollIndicator={false}
    >
      {cartItems.map((item, index) => renderCartItem(item, index))}
    </ScrollView>
  );

  const renderCheckoutBar = () => (
    <View style={styles.checkoutBar}>
      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>Tổng cộng:</Text>
        <Text style={styles.totalPrice}>
          {new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
          }).format(totalPrice)}
        </Text>
      </View>
      <Button
        title={`Thanh toán (${totalItems})`}
        onPress={onCheckout}
        variant="primary"
        fullWidth
        disabled={cartItems.length === 0}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      {cartItems.length === 0 ? renderEmptyCart() : renderCartItems()}
      {cartItems.length > 0 && renderCheckoutBar()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Sizes.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.white,
  },
  backButton: {
    padding: Sizes.sm,
  },
  backIcon: {
    fontSize: Sizes.iconLg,
    color: Colors.textPrimary,
  },
  headerTitle: {
    fontSize: Sizes.fontSizeLg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  clearButton: {
    color: Colors.error,
    fontSize: Sizes.fontSizeSm,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Sizes.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Sizes.md,
  },
  emptyTitle: {
    fontSize: Sizes.fontSizeXl,
    fontWeight: 'bold',
    marginBottom: Sizes.xs,
    color: Colors.textPrimary,
  },
  emptyText: {
    fontSize: Sizes.fontSizeMd,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Sizes.xl,
  },
  continueShoppingButton: {
    width: '100%',
  },
  cartItemsContainer: {
    flex: 1,
    padding: Sizes.md,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Sizes.sm,
    padding: Sizes.md,
    marginBottom: Sizes.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: Sizes.sm,
    marginRight: Sizes.md,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: Sizes.fontSizeMd,
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  itemOptions: {
    marginBottom: Sizes.xs,
  },
  itemOption: {
    fontSize: Sizes.fontSizeSm,
    color: Colors.textSecondary,
  },
  itemPrice: {
    fontSize: Sizes.fontSizeMd,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  itemActions: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Sizes.sm,
    overflow: 'hidden',
  },
  quantityButton: {
    padding: Sizes.xs,
    minWidth: 32,
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  quantityButtonText: {
    fontSize: Sizes.fontSizeLg,
    color: Colors.textPrimary,
  },
  quantityText: {
    paddingHorizontal: Sizes.sm,
    fontSize: Sizes.fontSizeMd,
    color: Colors.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  removeButton: {
    padding: Sizes.xs,
  },
  removeButtonText: {
    fontSize: Sizes.iconMd,
  },
  checkoutBar: {
    padding: Sizes.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Sizes.md,
  },
  totalText: {
    fontSize: Sizes.fontSizeLg,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  totalPrice: {
    fontSize: Sizes.fontSizeLg,
    fontWeight: 'bold',
    color: Colors.primary,
  },
});

export default CartScreen;