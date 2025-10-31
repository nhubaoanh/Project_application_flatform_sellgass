# 📱 Hướng dẫn sử dụng API từ React Native

## 🔄 Thay đổi từ BE cũ sang BE mới (NestJS)

### 1. **Cập nhật API Base URL**
```typescript
// Cũ: http://192.168.1.73:8080/api
// Mới: http://192.168.1.73:7890/api
```

### 2. **Cấu trúc dữ liệu mới**

#### **Product Interface (Sản phẩm)**
```typescript
interface Product {
  id?: number;
  masp: string;                    // Mã sản phẩm
  tensp: string;                   // Tên sản phẩm
  model?: string;                  // Model
  id_danhmuc: number;              // ID danh mục
  id_thuonghieu: number;           // ID thương hiệu
  id_xuatxu: number;               // ID xuất xứ
  id_chatlieu: number;             // ID chất liệu
  id_kieudang: number;             // ID kiểu dáng
  mo_ta?: string;                  // Mô tả
  hinh_anh?: string;               // Hình ảnh
  san_pham_moi?: boolean;          // Sản phẩm mới
  san_pham_noi_bat?: boolean;      // Sản phẩm nổi bật
  ngay_tao?: string;               // Ngày tạo
  ngay_cap_nhat?: string;          // Ngày cập nhật
  // Relations
  danhmuc?: Category;              // Thông tin danh mục
  thuonghieu?: any;                // Thông tin thương hiệu
  xuatxu?: any;                    // Thông tin xuất xứ
  chatlieu?: any;                  // Thông tin chất liệu
  kieudang?: any;                  // Thông tin kiểu dáng
}
```

#### **Category Interface (Danh mục)**
```typescript
interface Category {
  id?: number;
  ten_danhmuc: string;             // Tên danh mục
  mo_ta?: string;                  // Mô tả
  hinh_anh?: string;               // Hình ảnh
  trang_thai?: boolean;            // Trạng thái
  ngay_tao?: string;               // Ngày tạo
  ngay_cap_nhat?: string;          // Ngày cập nhật
}
```

## 🚀 Cách sử dụng trong React Native

### 1. **Import API Service**
```typescript
import apiService, { Product, Category } from "@/src/service/apiService";
```

### 2. **State Management**
```typescript
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

### 3. **Fetch Data với useEffect**
```typescript
useEffect(() => {
  fetchData();
}, []);

const fetchData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch multiple APIs in parallel
    const [productsRes, featuredRes, newRes] = await Promise.all([
      apiService.getAllProducts(),
      apiService.getFeaturedProducts(),
      apiService.getNewProducts()
    ]);

    if (productsRes.success && productsRes.data) {
      setProducts(productsRes.data);
    }

    if (featuredRes.success && featuredRes.data) {
      setFeaturedProducts(featuredRes.data);
    }

    if (newRes.success && newRes.data) {
      setNewProducts(newRes.data);
    }

  } catch (err) {
    console.error('Error fetching data:', err);
    setError('Không thể tải dữ liệu. Vui lòng thử lại.');
  } finally {
    setLoading(false);
  }
};
```

### 4. **Render với Loading & Error States**
```typescript
{loading ? (
  <Text style={styles.loadingText}>Đang tải...</Text>
) : error ? (
  <Text style={styles.errorText}>{error}</Text>
) : (
  <FlatList
    data={products}
    renderItem={({ item }) => (
      <ProductCard
        product={{
          id: item.id?.toString() || '',
          name: item.tensp,
          price: 0, // Cần thêm giá vào API
          image: item.hinh_anh || '',
          isFeatured: item.san_pham_noi_bat || false,
          category: item.danhmuc?.ten_danhmuc || ''
        }}
        onPress={() => handleProductPress(item.id?.toString() || '')}
      />
    )}
    keyExtractor={(item) => item.id?.toString() || ''}
  />
)}
```

## 📋 Các API Endpoints có sẵn

### **Sản phẩm (Products)**
```typescript
// Lấy tất cả sản phẩm
const products = await apiService.getAllProducts();

// Lấy sản phẩm theo ID
const product = await apiService.getProductById(1);

// Lấy sản phẩm mới
const newProducts = await apiService.getNewProducts();

// Lấy sản phẩm nổi bật
const featuredProducts = await apiService.getFeaturedProducts();

// Lấy sản phẩm theo danh mục
const categoryProducts = await apiService.getProductsByCategory(1);

// Tạo sản phẩm mới
const newProduct = await apiService.createProduct({
  masp: "SP001",
  tensp: "Kính mắt Ray-Ban",
  model: "RB3025",
  id_danhmuc: 1,
  id_thuonghieu: 1,
  id_xuatxu: 1,
  id_chatlieu: 1,
  id_kieudang: 1,
  mo_ta: "Kính mắt cao cấp",
  hinh_anh: "rayban.jpg",
  san_pham_moi: true,
  san_pham_noi_bat: true
});

// Cập nhật sản phẩm
const updatedProduct = await apiService.updateProduct(1, {
  tensp: "Kính mắt Ray-Ban Updated"
});

// Xóa sản phẩm
const result = await apiService.deleteProduct(1);
```

### **Danh mục (Categories)**
```typescript
// Lấy tất cả danh mục
const categories = await apiService.getAllCategories();

// Lấy danh mục theo ID
const category = await apiService.getCategoryById(1);

// Tạo danh mục mới
const newCategory = await apiService.createCategory({
  ten_danhmuc: "Kính mắt nam",
  mo_ta: "Danh mục kính mắt dành cho nam",
  hinh_anh: "category.jpg",
  trang_thai: true
});

// Cập nhật danh mục
const updatedCategory = await apiService.updateCategory(1, {
  ten_danhmuc: "Kính mắt nam Updated"
});

// Xóa danh mục
const result = await apiService.deleteCategory(1);
```

### **Health Check**
```typescript
// Kiểm tra trạng thái server
const health = await apiService.healthCheck();
```

## 🔧 Xử lý lỗi

### **Error Handling Pattern**
```typescript
const handleApiCall = async () => {
  try {
    const response = await apiService.getAllProducts();
    
    if (response.success && response.data) {
      // Xử lý dữ liệu thành công
      setProducts(response.data);
    } else {
      // Xử lý lỗi từ API
      setError(response.error || 'Có lỗi xảy ra');
    }
  } catch (error) {
    // Xử lý lỗi network hoặc parsing
    console.error('API Error:', error);
    setError('Không thể kết nối đến server');
  }
};
```

## 🎯 Best Practices

### 1. **Loading States**
- Luôn hiển thị loading state khi gọi API
- Sử dụng skeleton loading cho UX tốt hơn

### 2. **Error Handling**
- Hiển thị thông báo lỗi rõ ràng
- Cung cấp nút retry khi có lỗi
- Log lỗi để debug

### 3. **Data Transformation**
- Transform dữ liệu từ API sang format phù hợp với UI
- Sử dụng default values cho các field optional

### 4. **Performance**
- Sử dụng Promise.all() cho multiple API calls
- Implement pagination cho danh sách lớn
- Cache dữ liệu khi cần thiết

## 🚨 Lưu ý quan trọng

1. **IP Address**: Đảm bảo IP address trong API_BASE_URL đúng với máy chạy backend
2. **Port**: Backend NestJS chạy trên port 7890
3. **CORS**: Backend đã cấu hình CORS cho React Native
4. **Data Format**: API trả về dữ liệu theo format mới, cần update UI components
5. **Error Messages**: Sử dụng tiếng Việt cho error messages

## 🔄 Migration Checklist

- [x] Cập nhật API_BASE_URL
- [x] Cập nhật Product interface
- [x] Cập nhật Category interface
- [x] Thêm loading states
- [x] Thêm error handling
- [x] Update HomeScreen để sử dụng API mới
- [ ] Test tất cả API endpoints
- [ ] Update các screen khác
- [ ] Thêm pagination nếu cần
- [ ] Implement caching
