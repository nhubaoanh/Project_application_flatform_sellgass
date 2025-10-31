import Category from "../types/category";
import apiService, {ApiResponse} from "./apiService";

class CategoryService {
  async getAllCategories(): Promise<ApiResponse<Category[]>> {
    return apiService.makeRequest<Category[]>("/danhmuc");
  }

  async getCategoryById(id: number): Promise<ApiResponse<Category>> {
    return apiService.makeRequest<Category>(`/danhmuc/loaisanpham/${id}`);
  }

  async createCategory(categoryData: Category): Promise<ApiResponse<Category>> {
    return apiService.makeRequest<Category>("/danhmuc", {
      method: "POST",
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(
    id: number,
    categoryData: Category
  ): Promise<ApiResponse<Category>> {
    return apiService.makeRequest<Category>(`/danhmuc/${id}`, {
      method: "PUT",
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id: number): Promise<ApiResponse<any>> {
    return apiService.makeRequest(`/danhmuc/${id}`, {
      method: "DELETE",
    });
  }
}

const categoryService = new CategoryService();
export default categoryService;
