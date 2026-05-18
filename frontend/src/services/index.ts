import { api } from '@/lib/api'
import type { AuthResponse, ApiResponse, PageResponse, Customer, CustomerRequest, Product, ProductRequest, DashboardSummary, RevenueDataPoint, Activity } from '@/types'

// Auth
export const authService = {
  login: (email: string, password: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/login', { email, password }),

  register: (data: { name: string; email: string; company: string; password: string }) =>
    api.post<ApiResponse<AuthResponse>>('/auth/register', data),

  refresh: (refreshToken: string) =>
    api.post<ApiResponse<AuthResponse>>('/auth/refresh', { refreshToken }),
}

// Customers
export const customerService = {
  list: (params: { search?: string; status?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<PageResponse<Customer>>>('/customers', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Customer>>(`/customers/${id}`),

  create: (data: CustomerRequest) =>
    api.post<ApiResponse<Customer>>('/customers', data),

  update: (id: string, data: CustomerRequest) =>
    api.put<ApiResponse<Customer>>(`/customers/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/customers/${id}`),
}

// Products
export const productService = {
  list: (params: { search?: string; status?: string; category?: string; page?: number; size?: number }) =>
    api.get<ApiResponse<PageResponse<Product>>>('/products', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Product>>(`/products/${id}`),

  create: (data: ProductRequest) =>
    api.post<ApiResponse<Product>>('/products', data),

  update: (id: string, data: ProductRequest) =>
    api.put<ApiResponse<Product>>(`/products/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/products/${id}`),
}

// Dashboard
export const dashboardService = {
  getSummary: () =>
    api.get<ApiResponse<DashboardSummary>>('/dashboard/summary'),

  getRevenueChart: () =>
    api.get<ApiResponse<RevenueDataPoint[]>>('/dashboard/revenue-chart'),

  getRecentActivity: () =>
    api.get<ApiResponse<Activity[]>>('/dashboard/recent-activity'),
}
