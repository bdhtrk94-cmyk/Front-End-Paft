export interface Product {
  id: number;
  name: string;
  nameAr?: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  category: string;
  categoryAr?: string;
  image: string;
  badge?: string;
  inStock: boolean;
  stockQuantity: number;
  description: string;
  descriptionAr?: string;
  fullDescription?: string;
  fullDescriptionAr?: string;
  // Pallet-specific fields
  slug?: string;
  dimensions?: string;
  design?: string;
  weight?: string;
  staticLoad?: string;
  dynamicLoad?: string;
  rackLoad?: string;
  expectedLife?: string;
  isActive?: boolean;
  sortOrder?: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface Order {
  id: number;
  customerId: number;
  products: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: Date;
  deliveryDate?: Date;
  notes?: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  unitPrice: string;
  totalPrice: string;
}

export interface ContactForm {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  productType?: string;
  message: string;
}

export interface QuoteRequest {
  id: number;
  customerInfo: ContactForm;
  products: {
    productId: number;
    quantity: number;
  }[];
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  createdAt: Date;
  validUntil: Date;
}