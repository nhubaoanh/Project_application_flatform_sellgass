
import Product from "../types/product";
import apiService, { ApiResponse } from "./apiService";


class ProductService {
  // Lấy tất cả sản phẩm
  async getAllProducts(): Promise<ApiResponse<Product[]>> {
    console.log("apiService", apiService);
    return apiService.makeRequest<Product[]>("/sanpham");
  }

  // Lấy sản phẩm theo ID
  async getProductById(id: number): Promise<ApiResponse<Product>> {
    return apiService.makeRequest<Product>(`/sanpham/${id}`);
  }

  // Lấy sản phẩm nổi bật
  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest<Product[]>("/sanpham/featured");
  }

  // Lấy sản phẩm theo danh mục
  async getProductsByCategory(
    categoryId: number
  ): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest<Product[]>(`/sanpham/category/${categoryId}`);
  }

  // Tạo sản phẩm mới
  async createProduct(productData: Product): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest<Product[]>("/sanpham", {
      method: "POST",
      body: JSON.stringify(productData),
    });
  }

  // Cập nhật sản phẩm
  async updateProduct(
    id: number,
    productData: Product
  ): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest<Product[]>(`/sanpham/${id}`, {
      method: "PUT",
      body: JSON.stringify(productData),
    });
  }

  // Xóa sản phẩm
  async deleteProduct(id: number): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest(`/sanpham/${id}`, {
      method: "DELETE",
    });
  }

  // Tìm kiếm sản phẩm
  async searchProducts(query: string): Promise<ApiResponse<Product[]>> {
    return apiService.makeRequest<Product[]>(
      `/sanpham/search?q=${encodeURIComponent(query)}`
    );
  }
  

  // Cập nhật hình ảnh sản phẩm
  async updateProductImage(
    id: number,
    imageUri: string
  ): Promise<ApiResponse<Product[]>> {
    const formData = new FormData();
    formData.append("image", {
      uri: imageUri,
      type: "image/jpeg", // hoặc lấy từ file
      name: "product-image.jpg",
    } as any);

    return apiService.makeRequest<Product[]>(`/sanpham/${id}/image`, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  }
}

// Export singleton instance
const productService = new ProductService();
export default productService;