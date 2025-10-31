import CartScreen from '@/src/screens/cart/CartScreen';
import { useRouter } from 'expo-router';

import { useCart } from '@/src/context/CartContext';
import { Alert } from 'react-native';

export default function Cart() {
    const router = useRouter();
    const { cartItems, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
    
    const handleBack = () => {
        router.back();
    };

    const handleCheckout = () => {
        // Navigate to checkout page when implemented
        if (cartItems.length === 0) {
            Alert.alert('Thông báo', 'Vui lòng thêm sản phẩm vào giỏ hàng trước khi thanh toán');
            return;
        }
        router.push({
            pathname: '/order/checkout',
            params: {
                cartItems: JSON.stringify(cartItems),
                totalPrice: totalPrice.toString(),
                totalItems: totalItems.toString()
            }
        });
    };

    return (
        <CartScreen 
            onBack={() => handleBack()}
            onCheckout={() => handleCheckout()}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
            totalItems={totalItems}
            totalPrice={totalPrice}
        />
    );
}
