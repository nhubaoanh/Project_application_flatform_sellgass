import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from "react-native";
import { Colors } from "../../../constants/colors";
import { Sizes } from "../../../constants/sizes";
import { useCart } from "../../context/CartContext";
import apiService, { Product as ApiProduct } from "../../service/apiService";
import productService from "@/src/service/product.Service";
import { useUser } from "../../context/UserContext";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

interface ProductDetailScreenProps {
  productId?: number;
}

// truyền cái id của sản phẩm vào đây và để zen dữ liệu ra
const ProductDetailScreen: React.FC<ProductDetailScreenProps> = ({
  productId,
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [showSuccess, setShowSuccess] = useState(false);

  const { isLoggedIn} = useUser();
  const router = useRouter();

  // Fetch product data from API
  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // lấy các sản phẩm lên
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      // const response = await apiService.getProductById(productId || 0);
      const response = await productService.getProductById(productId || 0);

      if (response.success && response.data) {
        setProduct(response.data);
        console.log("Product data:", response.data);
      } else {
        setError("Không thể tải thông tin sản phẩm");
      }
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  };

  // lấy dữ liệu nhét vô addToCart chuyển xuống cartContext
  const handleAddToCart = () => {
    if (!isLoggedIn) {
      alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng");
      // router.push("/(drawers)/login");
      return;
    }
    if (!product) return;

    const color = selectedColor || product.mausac || "Mặc định";
    const size = selectedSize || product.kichthuoc || "Mặc định";

    addToCart(product, quantity, color, size);

    // Show success message
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart screen
    // navigation.navigate('Cart');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const renderImageGallery = () => {
    const getImageSource = () => {
      if (!product?.hinhanh) {
        return { uri: "https://via.placeholder.com/300x400?text=No+Image" };
      }

      const imageUrl = apiService.getImageUrl(product.hinhanh);
      return { uri: imageUrl };
    };

    return (
      <View style={styles.imageGallery}>
        <Image
          source={getImageSource()}
          style={styles.mainImage}
          resizeMode="contain"
        />
        {/* Thumbnail images - có thể thêm sau khi có multiple images */}
      </View>
    );
  };

  const renderProductInfo = () => (
    <View style={styles.productInfo}>
      <Text style={styles.brand}>{product?.thuonghieu || "Thương hiệu"}</Text>
      <Text style={styles.name}>{product?.tensp || "Tên sản phẩm"}</Text>

      <View style={styles.ratingContainer}>
        <Text style={styles.rating}>⭐ 4.5</Text>
        <Text style={styles.reviewCount}>(0 đánh giá)</Text>
      </View>

      <View style={styles.priceContainer}>
        <Text style={styles.currentPrice}>
          {formatPrice(product?.gia || 0)}
        </Text>
        {/* Có thể thêm giá gốc và discount sau */}
      </View>

      <Text style={styles.description}>
        Màu sắc: {product?.mausac || "N/A"}
        {"\n"}
        Kiểu dáng: {product?.kieudang || "N/A"}
        {"\n"}
        Kích thước: {product?.kichthuoc || "N/A"}
        {"\n"}
        Chất liệu: {product?.chatlieu || "N/A"}
      </Text>
    </View>
  );

  const renderColorSelection = () => (
    <View style={styles.selectionSection}>
      <Text style={styles.sectionTitle}>Màu sắc</Text>
      <View style={styles.colorOptions}>
        <TouchableOpacity
          style={[
            styles.colorOption,
            selectedColor === (product?.mausac || "") &&
              styles.colorOptionSelected,
          ]}
          onPress={() => setSelectedColor(product?.mausac || "")}
        >
          <View style={[styles.colorCircle, { backgroundColor: "#007AFF" }]} />
          <Text style={styles.colorName}>{product?.mausac || "Mặc định"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSizeSelection = () => (
    <View style={styles.selectionSection}>
      <Text style={styles.sectionTitle}>Kích thước</Text>
      <View style={styles.storageOptions}>
        <TouchableOpacity
          style={[
            styles.storageOption,
            selectedSize === (product?.kichthuoc || "") &&
              styles.storageOptionSelected,
          ]}
          onPress={() => setSelectedSize(product?.kichthuoc || "")}
        >
          <Text style={styles.storageCapacity}>
            {product?.kichthuoc || "Mặc định"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQuantitySelector = () => (
    <View style={styles.quantitySection}>
      <Text style={styles.sectionTitle}>Số lượng</Text>
      <View style={styles.quantityContainer}>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(Math.max(1, quantity - 1))}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity
          style={styles.quantityButton}
          onPress={() => setQuantity(quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSpecifications = () => (
    <View style={styles.specificationsSection}>
      <Text style={styles.sectionTitle}>Thông số kỹ thuật</Text>
      <View style={styles.specificationsList}>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Mã sản phẩm</Text>
          <Text style={styles.specificationValue}>
            {product?.masp || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Thương hiệu</Text>
          <Text style={styles.specificationValue}>
            {product?.thuonghieu || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Màu sắc</Text>
          <Text style={styles.specificationValue}>
            {product?.mausac || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Kiểu dáng</Text>
          <Text style={styles.specificationValue}>
            {product?.kieudang || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Kích thước</Text>
          <Text style={styles.specificationValue}>
            {product?.kichthuoc || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Chất liệu</Text>
          <Text style={styles.specificationValue}>
            {product?.chatlieu || "N/A"}
          </Text>
        </View>
        <View style={styles.specificationItem}>
          <Text style={styles.specificationKey}>Mã loại</Text>
          <Text style={styles.specificationValue}>
            {product?.maloai || "N/A"}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderImageGallery()}
        {renderProductInfo()}
        {renderColorSelection()}
        {renderSizeSelection()}
        {renderQuantitySelector()}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.addToCartButton]}
            onPress={handleAddToCart}
          >
            <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
          </TouchableOpacity>
{/* 
          <TouchableOpacity
            style={[styles.button, styles.buyNowButton]}
            onPress={handleBuyNow}
          >
            <Text style={[styles.buttonText, styles.buyNowButtonText]}>
              Mua ngay
            </Text>
          </TouchableOpacity> */}
        </View>
        {showSuccess && (
          <View style={styles.successMessage}>
            <Text style={styles.successText}>Đã thêm vào giỏ hàng!</Text>
          </View>
        )}
        {renderSpecifications()}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageGallery: {
    backgroundColor: Colors.white,
    paddingBottom: Sizes.md,
  },
  mainImage: {
    width: width,
    height: width * 0.8,
    resizeMode: "contain",
  },
  productInfo: {
    backgroundColor: Colors.white,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
  },
  brand: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: "600",
    marginBottom: Sizes.xs,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: Sizes.sm,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.sm,
  },
  rating: {
    fontSize: 16,
    color: Colors.textPrimary,
    marginRight: Sizes.xs,
  },
  reviewCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Sizes.md,
  },
  currentPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
    marginRight: Sizes.sm,
  },
  description: {
    fontSize: 16,
    color: Colors.textSecondary,
    lineHeight: 24,
  },
  selectionSection: {
    backgroundColor: Colors.white,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Sizes.md,
  },
  colorOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  colorOption: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: Sizes.md,
    marginBottom: Sizes.sm,
    padding: Sizes.sm,
    borderRadius: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  colorOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  colorCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: Sizes.xs,
  },
  colorName: {
    fontSize: 14,
    color: Colors.textPrimary,
  },
  storageOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  storageOption: {
    padding: Sizes.sm,
    marginRight: Sizes.sm,
    marginBottom: Sizes.sm,
    borderRadius: Sizes.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
    minWidth: 80,
  },
  storageOptionSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + "10",
  },
  storageCapacity: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginBottom: Sizes.xs,
  },
  quantitySection: {
    backgroundColor: Colors.white,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.grayLight,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.textPrimary,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.textPrimary,
    marginHorizontal: Sizes.lg,
    minWidth: 30,
    textAlign: "center",
  },
  specificationsSection: {
    backgroundColor: Colors.white,
    padding: Sizes.md,
    marginBottom: Sizes.sm,
  },
  specificationsList: {
    gap: Sizes.sm,
  },
  specificationItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: Sizes.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  specificationKey: {
    fontSize: 14,
    color: Colors.textSecondary,
    flex: 1,
  },
  specificationValue: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  actionButtons: {
    flexDirection: "row",
    padding: Sizes.md,
    gap: Sizes.md,
  },
  button: {
    flex: 1,
    padding: Sizes.md,
    borderRadius: Sizes.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  addToCartButton: {
    backgroundColor: Colors.primary,
  },
  buyNowButton: {
    backgroundColor: Colors.secondary,
  },
  buttonText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: Sizes.fontSizeMd,
  },
  buyNowButtonText: {
    color: Colors.textPrimary,
  },
  successMessage: {
    backgroundColor: Colors.successLight,
    margin: Sizes.md,
    padding: Sizes.md,
    borderRadius: Sizes.sm,
    alignItems: "center",
  },
  successText: {
    color: Colors.success,
    fontWeight: "bold",
  },
});

export default ProductDetailScreen;
