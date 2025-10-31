import React from "react";
import {
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Text,
  View,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { useCart } from "@/src/context/CartContext";
import { Colors } from "@/constants/colors";
import { Sizes } from "@/constants/sizes";

import { BannerSlider } from "@/src/screens/home/components/BannerSlider";
import { CategoryGrid } from "@/src/screens/home/components/CategoryGrid";
import { ProductList } from "@/src/screens/home/components/ProductList";
import { useHomeData } from "@/src/screens/home/hooks/useHomeData";
import { Header } from "./components/Header";

export default function HomeScreen() {
  const router = useRouter();
  // const { totalItems } = useCart();
  const { user, loading } = useHomeData();

  const {
    products,
    category,
    refreshing,
    handleRefresh,
    currentBannerIndex,
    setCurrentBannerIndex,
    bannerRef,
  } = useHomeData();

  const handleProductPress = (masp: number) => {
    router.push({ pathname: "/product/[id]", params: { id: masp.toString() } });
  };

  const handleCategoryPress = (maloai: number) => {
    // console.log("Chọn danh mục:", maloai);
    router.push({
      pathname: "/category/[id]",
      params: { id: maloai.toString() },
    });

  };

  const banners = [
    {
      id: 1,
      title: "Khuyến mãi lớn",
      subtitle: "Giảm giá lên đến 50%",
      color: Colors.primary,
      image:
        "https://www.dichvuinnhanh.com/wp-content/uploads/2025/04/hinh-nen-dep-anh-dep-innhanh.pro_.vn-1.webp",
    },
    {
      id: 2,
      title: "Siêu sale 8.8",
      subtitle: "Giảm ngay 100K",
      color: "#FF6B6B",
      image:
        "https://www.dichvuinnhanh.com/wp-content/uploads/2025/04/hinh-nen-dep-anh-dep-innhanh.pro_.vn-1.webp",
    },
    {
      id: 3,
      title: "Miễn phí vận chuyển",
      subtitle: "Đơn từ 0đ",
      color: "#4ECDC4",
      image:
        "https://www.dichvuinnhanh.com/wp-content/uploads/2025/04/hinh-nen-dep-anh-dep-innhanh.pro_.vn-1.webp",
    },
  ];


  return (
    <SafeAreaView style={styles.container}>
      {!loading && (
        <Header user={user} onLoginPress={() => router.push("/login")} />
      )}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <BannerSlider
          banners={banners}
          bannerRef={bannerRef}
          currentIndex={currentBannerIndex}
          setCurrentIndex={setCurrentBannerIndex}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục sản phẩm</Text>
          <CategoryGrid categories={category} onPress={handleCategoryPress} />
        </View>

        {products.some((p) => p.noibat === 1) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Sản phẩm nổi bật</Text>
            <ProductList
              products={products.filter((p) => p.noibat === 1)}
              onPress={handleProductPress}
              horizontal
            />
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sản phẩm mới</Text>
          <ProductList products={products} onPress={handleProductPress} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  section: { padding: Sizes.md },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: Sizes.md },
});
