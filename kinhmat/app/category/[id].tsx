import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";
import { ProductList } from "@/src/screens/home/components/ProductList";
import categoryService from "@/src/service/category.service";

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    // 🔹 Gọi API lấy sản phẩm theo danh mục
    const fetchCategoryData = async () => {
      try {
        const res = await categoryService.getCategoryById(Number(id));
        const data = res.data;
        console.log("📦 Category data:", data);
        setCategoryName(data?.tenloai || "Danh mục");
        setProducts(data?.sanpham || []); // ✅ nhận đúng key 'sanpham'
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      } finally {
        setLoading(false);
      }
    };


    fetchCategoryData();
  }, [id]);

  const handleProductPress = (masp: number) => {
    router.push({ pathname: "/product/[id]", params: { id: masp.toString() } });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen options={{ title: categoryName }} />
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{categoryName}</Text>
        </View>

        {products.length > 0 ? (
          <ProductList products={products} onPress={handleProductPress} />
        ) : (
          <Text style={styles.noProduct}>
            Chưa có sản phẩm trong danh mục này.
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { padding: Sizes.lg },
  title: { fontSize: 22, fontWeight: "bold" },
  noProduct: {
    textAlign: "center",
    color: "#999",
    marginTop: 40,
    fontSize: 16,
  },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
