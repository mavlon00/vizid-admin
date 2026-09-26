export type UserRole = 'customer' | 'admin';

export interface Profile {
  id: string;
  email: string | null;
  role: UserRole;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number | null;
  description: string | null;
  image_url: string | null;
  created_by?: string | null;
  created_at: string;
}

export interface ProductFormData {
  name: string;
  category: string;
  customCategory?: string;
  price: string;
  description: string;
  imageFile?: File | null;
  keepExistingImage?: boolean;
}

export type OrderStatus = 'pending' | 'paid' | 'processing' | 'shipped' | 'delivered' | 'failed' | 'cancelled';

export interface OrderItem {
  id?: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
  category?: string;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  delivery_address: string;
  phone_number: string;
  status: OrderStatus;
  paystack_reference: string | null;
  created_at: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  paidOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
  duration?: number;
}

export const PRODUCT_CATEGORIES = [
  'New',
  'Furniture',
  'Outdoor',
  'Lighting',
  'Rugs',
  'Decor & Pillows',
  'Wall Decor',
  'Bed & Bath',
  'Kitchen & Dining',
] as const;
