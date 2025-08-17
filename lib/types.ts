export interface User {
  id: string
  email: string
  role: "admin" | "worker"
  full_name?: string
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  sku?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  product_id: string
  worker_id: string
  quantity: number
  unit_price: number
  total_amount: number
  sale_date: string
  notes?: string
  created_at: string
  // Joined data
  product?: Product
  worker?: User
}
