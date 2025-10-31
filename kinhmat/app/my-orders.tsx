import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import apiService, { Order } from "@/src/service/apiService";

// ⚙️ Bật animation cho Android
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const MyOrdersScreen = () => {
  const { userId } = useLocalSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        if (userId) {
          const res = await apiService.getMyOrders(Number(userId));
          if (res.success && Array.isArray(res.data)) {
            setOrders(res.data);
          }
        }
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [userId]);

  const formatPrice = (price: number | string) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(price));

  const toggleExpand = (madh: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrder(expandedOrder === madh ? null : madh);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Đơn hàng của tôi</Text>
        <Text>Chưa có đơn hàng nào.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Đơn hàng của tôi ({orders.length})</Text>
      <ScrollView showsVerticalScrollIndicator={false}>
        {orders.map((order: Order) => (
          <TouchableOpacity
            key={order.madh}
            style={styles.orderCard}
            activeOpacity={0.8}
            onPress={() => toggleExpand(order.madh)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Đơn hàng #{order.madh}</Text>
                <Text style={styles.orderDate}>
                  {new Date(order.ngaydat).toLocaleDateString("vi-VN")}
                </Text>
              </View>
              <Text
                style={[
                  styles.statusTag,
                  { backgroundColor: Colors.primary + "33" },
                ]}
              >
                {order.mapt ?? "Đang xử lý"}
              </Text>
            </View>

            <View style={styles.summaryRow}>
              <Text>Phương thức: {order.paymentMethod}</Text>
              <Text style={styles.totalValue}>
                {formatPrice(order.tongtien)}
              </Text>
            </View>

            {expandedOrder === order.madh && (
              <View style={styles.detailSection}>
                <Text style={styles.subTitle}>Sản phẩm</Text>
                {order.items.map((sp, idx) => (
                  <View key={idx} style={styles.productRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.productName}>Tên sản phẩm : {sp.tensp}</Text>
                      <Text style={styles.productInfo}>
                        Số Lượng : {sp.soluong} × {formatPrice(sp.dongia)}
                      </Text>
                    </View>
                    {/* <Text style={styles.productPrice}>
                      {formatPrice(sp.thanhtien)}
                    </Text> */}
                  </View>
                ))}

                <View style={styles.addressBox}>
                  <Text style={styles.subTitle}>Địa chỉ giao hàng</Text>
                  <Text style={styles.addressText}>{order.diachi_giao}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Sizes.screenPadding,
  },
  title: {
    fontSize: Sizes.fontSizeLg,
    fontWeight: "700",
    marginBottom: Sizes.md,
    color: Colors.primary,
  },
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontWeight: "700",
    fontSize: 16,
    color: Colors.primary,
  },
  orderDate: { fontSize: 13, color: "#666" },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontSize: 12,
    color: Colors.primary,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  totalValue: { fontWeight: "700", color: Colors.primary },
  detailSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 8,
  },
  subTitle: {
    fontWeight: "600",
    marginBottom: 4,
    color: "#444",
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  productName: { fontWeight: "500", color: "#222" },
  productInfo: { color: "#666", fontSize: 13 },
  productPrice: { fontWeight: "600" },
  addressBox: { marginTop: 10 },
  addressText: { fontSize: 13, color: "#555" },
});

export default MyOrdersScreen;
