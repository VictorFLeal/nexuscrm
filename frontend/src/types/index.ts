// Auth
export interface User {
  id: string
  name: string
  email: string
  company: string
  role: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  user: User
}

// API
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PageResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

// Customer
export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: 'ACTIVE' | 'INACTIVE' | 'LEAD'
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface CustomerRequest {
  name: string
  email?: string
  phone?: string
  company?: string
  status: string
  notes?: string
}

// Product
export interface Product {
  id: string
  name: string
  sku: string
  description?: string
  price: number
  stock: number
  category?: string
  status: 'ACTIVE' | 'INACTIVE'
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface ProductRequest {
  name: string
  sku: string
  description?: string
  price: number
  stock: number
  category?: string
  status: string
  imageUrl?: string
}

// Dashboard
export interface DashboardSummary {
  totalCustomers: number
  activeCustomers: number
  totalProducts: number
  monthlyRevenue: number
  revenueGrowth: number
  conversionRate: number
  avgTicket: number
}

export interface RevenueDataPoint {
  month: string
  revenue: number
  customers: number
}

export interface Activity {
  id: number
  type: 'customer' | 'product'
  message: string
  time: string
}
