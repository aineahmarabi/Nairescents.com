export const BRANDS = ['Lattafa', 'Fragrance World', 'French Avenue', 'Maison Alhambra', 'Ard Al Zaafaran'] as const;
export const GENDERS = ['Men', 'Women', 'Unisex'] as const;
export const WHEN_TO_WEAR = ['Cold', 'Hot', 'Humid', 'Day', 'Night'] as const;

export type Brand = typeof BRANDS[number];
export type Gender = typeof GENDERS[number];
export type WhenToWear = typeof WHEN_TO_WEAR[number];

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPerItem?: number;
  images: string[];
  brand: Brand;
  gender: Gender;
  whenToWear: WhenToWear[];
  size: string;
  sku: string;
  inventory: number;
  trackInventory: boolean;
  inStock: boolean;
  sellWhenOutOfStock: boolean;
  status: 'Active' | 'Draft';
  tags: { bestSeller: boolean; featured: boolean; newIn: boolean };
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: { name: string; email: string; phone: string };
  items: OrderItem[];
  shippingAddress: string;
  total: number;
  paymentStatus: 'Pending' | 'Paid' | 'Refunded';
  fulfillmentStatus: 'Unfulfilled' | 'Fulfilled' | 'Cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  location: string;
  createdAt: string;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  usageLimit?: number;
  usageCount: number;
  expiresAt?: string;
  active: boolean;
  createdAt: string;
}

export interface HeroPanel {
  id: string;
  label: string;
  name: string;
  sub: string;
  href: string;
  bg: string;
  image: string;
}

export interface Settings {
  storeName: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  social: { facebook: string; instagram: string; tiktok: string };
}

export interface StoreUser {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  createdAt: string;
}

export interface Db {
  products: Product[];
  orders: Order[];
  customers: Customer[];
  discounts: Discount[];
  settings: Settings;
  hero: HeroPanel[];
  adminCredentials: { email: string; password: string };
  users: StoreUser[];
}
