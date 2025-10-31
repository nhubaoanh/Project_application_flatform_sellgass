import { uploadToCloudinary } from "@/src/service/cloudinary";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import apiService, { Product } from "../../src/service/apiService";
import productService from "@/src/service/product.Service";

const AdminScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    tensp: "",
    thuonghieu: "",
    gia: "",
    mausac: "",
    kieudang: "",
    kichthuoc: "",
    chatlieu: "",
  });

  useEffect(() => {
    requestPermissions();
    fetchProducts();
  }, []);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Lỗi", "Cần quyền truy cập thư viện ảnh để upload hình!");
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const result = await productService.getAllProducts();
      if (result.success && result.data) {
        setProducts(result.data);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchProducts();
    setRefreshing(false);
  };

  const pickImage = async (productId: number) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(productId, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không thể chọn ảnh");
    }
  };

  const uploadImage = async (productId: number, imageUri: string) => {
    try {
      setUploading(productId);
      console.log(
        "Starting upload for product:",
        productId,
        "with image:",
        imageUri
      );

      // Step 1: Upload to Cloudinary first
      console.log("Uploading to Cloudinary...");
      const cloudinaryResult = await uploadToCloudinary(imageUri);
      console.log("Cloudinary upload result:", cloudinaryResult);

      if (!cloudinaryResult.secure_url) {
        throw new Error("Failed to get Cloudinary URL");
      }

      // Step 2: Save Cloudinary URL to database
      console.log(
        "Saving Cloudinary URL to database:",
        cloudinaryResult.secure_url
      );
      const result = await productService.updateProductImage(productId, {
        hinhanh: cloudinaryResult.secure_url,
      } as any);

      if (result.success) {
        Alert.alert("Thành công", "Cập nhật ảnh sản phẩm thành công!");
        await fetchProducts(); // Refresh danh sách
      } else {
        Alert.alert("Lỗi", result.error || "Không thể cập nhật database");
      }
    } catch (error) {
      Alert.alert(
        "Lỗi",
        "Có lỗi xảy ra khi upload ảnh: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    } finally {
      setUploading(null);
    }
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      tensp: product.tensp || "",
      thuonghieu: product.thuonghieu || "",
      gia: product.gia?.toString() || "",
      mausac: product.mausac || "",
      kieudang: product.kieudang || "",
      kichthuoc: product.kichthuoc || "",
      chatlieu: product.chatlieu || "",
    });
    setModalVisible(true);
  };

  const saveProduct = async () => {
    if (!editingProduct) return;

    try {
      const updatedProduct: Product = {
        ...editingProduct,
        tensp: formData.tensp,
        thuonghieu: formData.thuonghieu,
        gia: parseFloat(formData.gia) || 0,
        mausac: formData.mausac,
        kieudang: formData.kieudang,
        kichthuoc: formData.kichthuoc,
        chatlieu: formData.chatlieu,
      };

      const result = await productService.updateProduct(
        editingProduct.masp!,
        updatedProduct
      );

      if (result.success) {
        Alert.alert("Thành công", "Cập nhật sản phẩm thành công!");
        setModalVisible(false);
        await fetchProducts();
      } else {
        Alert.alert("Lỗi", result.error || "Không thể cập nhật sản phẩm");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Có lỗi xảy ra khi cập nhật sản phẩm");
    }
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.productCard}>
      <View style={styles.imageContainer}>
        {item.hinhanh ? (
          <Image
            source={{ uri: apiService.getImageUrl(item.hinhanh) }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.noImageContainer}>
            <Text style={styles.noImageText}>Chưa có ảnh</Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => pickImage(item.masp!)}
          disabled={uploading === item.masp}
        >
          {uploading === item.masp ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.uploadButtonText}>📷 Đổi ảnh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.tensp}</Text>
        <Text style={styles.productBrand}>Thương hiệu: {item.thuonghieu}</Text>
        <Text style={styles.productPrice}>
          Giá: {item.gia?.toLocaleString()} VNĐ
        </Text>
        <Text style={styles.productDetails}>
          Màu: {item.mausac} | Kiểu: {item.kieudang}
        </Text>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => openEditModal(item)}
        >
          <Text style={styles.editButtonText}>✏️ Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔧 Quản Trị Sản Phẩm</Text>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) =>
          item.masp?.toString() || Math.random().toString()
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
      />

      {/* Modal chỉnh sửa sản phẩm */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>Chỉnh sửa sản phẩm</Text>

              <Text style={styles.inputLabel}>Tên sản phẩm:</Text>
              <TextInput
                style={styles.input}
                value={formData.tensp}
                onChangeText={(text) =>
                  setFormData({ ...formData, tensp: text })
                }
                placeholder="Nhập tên sản phẩm"
              />

              <Text style={styles.inputLabel}>Thương hiệu:</Text>
              <TextInput
                style={styles.input}
                value={formData.thuonghieu}
                onChangeText={(text) =>
                  setFormData({ ...formData, thuonghieu: text })
                }
                placeholder="Nhập thương hiệu"
              />

              <Text style={styles.inputLabel}>Giá:</Text>
              <TextInput
                style={styles.input}
                value={formData.gia}
                onChangeText={(text) => setFormData({ ...formData, gia: text })}
                placeholder="Nhập giá"
                keyboardType="numeric"
              />

              <Text style={styles.inputLabel}>Màu sắc:</Text>
              <TextInput
                style={styles.input}
                value={formData.mausac}
                onChangeText={(text) =>
                  setFormData({ ...formData, mausac: text })
                }
                placeholder="Nhập màu sắc"
              />

              <Text style={styles.inputLabel}>Kiểu dáng:</Text>
              <TextInput
                style={styles.input}
                value={formData.kieudang}
                onChangeText={(text) =>
                  setFormData({ ...formData, kieudang: text })
                }
                placeholder="Nhập kiểu dáng"
              />

              <Text style={styles.inputLabel}>Kích thước:</Text>
              <TextInput
                style={styles.input}
                value={formData.kichthuoc}
                onChangeText={(text) =>
                  setFormData({ ...formData, kichthuoc: text })
                }
                placeholder="Nhập kích thước"
              />

              <Text style={styles.inputLabel}>Chất liệu:</Text>
              <TextInput
                style={styles.input}
                value={formData.chatlieu}
                onChangeText={(text) =>
                  setFormData({ ...formData, chatlieu: text })
                }
                placeholder="Nhập chất liệu"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.cancelButtonText}>Hủy</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={saveProduct}
                >
                  <Text style={styles.saveButtonText}>Lưu</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 20,
    color: "#333",
  },
  listContainer: {
    padding: 15,
  },
  productCard: {
    backgroundColor: "white",
    marginBottom: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    height: 200,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  noImageContainer: {
    width: "100%",
    height: "100%",
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  noImageText: {
    color: "#999",
    fontSize: 16,
  },
  uploadButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#007AFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  uploadButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "600",
  },
  productInfo: {
    padding: 15,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#333",
  },
  productBrand: {
    fontSize: 14,
    color: "#666",
    marginBottom: 3,
  },
  productPrice: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginBottom: 5,
  },
  productDetails: {
    fontSize: 12,
    color: "#888",
    marginBottom: 10,
  },
  editButton: {
    backgroundColor: "#28a745",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  editButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "white",
    margin: 20,
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
    width: "90%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  saveButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default AdminScreen;
