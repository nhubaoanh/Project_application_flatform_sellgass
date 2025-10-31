import Customer from "../types/customer";
import apiService, { ApiResponse } from "./apiService";

class CustomerService {
  async getAllCustomers(): Promise<ApiResponse<Customer[]>> {
    return apiService.makeRequest<Customer[]>("/khachhang");
  }

  // ✅ Trả về 1 Customer hoặc null
  async getCustomerById(id: number): Promise<ApiResponse<Customer | null>> {
    const res = await apiService.makeRequest<Customer[]>(`/khachhang/${id}`);
    return {
      success: res.success,
      data: res.data && res.data.length > 0 ? res.data[0] : null,
      error: res.error,
    };
  }

  async createCustomer(customerData: Customer): Promise<ApiResponse<Customer>> {
    return apiService.makeRequest<Customer>("/khachhang", {
      method: "POST",
      body: JSON.stringify(customerData),
    });
  }

  async updateCustomer(
    id: number,
    customerData: Customer
  ): Promise<ApiResponse<Customer>> {
    return apiService.makeRequest<Customer>(`/khachhang/${id}`, {
      method: "PUT",
      body: JSON.stringify(customerData),
    });
  }

  async deleteCustomer(id: number): Promise<ApiResponse<any>> {
    return apiService.makeRequest(`/khachhang/${id}`, {
      method: "DELETE",
    });
  }
}

const customerService = new CustomerService();
export default customerService;
