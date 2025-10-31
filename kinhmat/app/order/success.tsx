import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

const OrderSuccessScreen = () => {
  const router = useRouter();
  const { orderId, total } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.icon}>✓</Text>
        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.subtitle}>Cảm ơn bạn đã mua hàng tại cửa hàng chúng tôi</Text>
        
        <View style={styles.orderInfo}>
          <Text style={styles.infoText}>Mã đơn hàng: <Text style={styles.infoValue}>{orderId}</Text></Text>
          <Text style={styles.infoText}>Tổng tiền: <Text style={styles.infoValue}>{total}đ</Text></Text>
          <Text style={styles.infoText}>Hình thức thanh toán: <Text style={styles.infoValue}>Thanh toán khi nhận hàng</Text></Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Theo dõi đơn hàng"
            onPress={() => router.push(`/(drawers)/orders`)}
            color="#3498db"
          />
          <Button
            title="Tiếp tục mua sắm"
            onPress={() => router.replace('/(drawers)/home')}
            color="#2ecc71"
            // ={styles.continueButton}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    marginTop: 40,
  },
  icon: {
    fontSize: 80,
    color: '#2ecc71',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  orderInfo: {
    width: '100%',
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 16,
    marginBottom: 8,
  },
  infoValue: {
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  continueButton: {
    marginTop: 10,
  },
});

export default OrderSuccessScreen;