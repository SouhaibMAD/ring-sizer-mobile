// src/services/products.ts
import { api } from './api';

// src/services/products.ts
export type ProductType = 'bague' | 'bracelet' | 'collier' | 'boucles' | 'montre';

export interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  type: ProductType;
  image: string | null;
  rating: number;
  available: boolean;
  vendor_id: number;   // vient du backend Laravel
  weight: number | null;
  carat: number | null;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  type: ProductType;
  image: string | null;
  rating: number;
  available: boolean;
  vendorId: number;    // version camelCase pour le front
  weight: number | null;
  carat: number | null;
}

import { API_BASE_URL } from '../config/apiConfig';

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch(`${API_BASE_URL}/products`);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: any[] = await res.json();

  // Debug: Log raw API response
  console.log('📦 Raw API products:', data.length);
  
  // On mappe vendor_id → vendorId pour ton front
  const mapped = data.map((p) => {
    const vendorId = p.vendor_id || p.vendor?.id || null;
    
    return {
      id: p.id,
      name: p.name,
      price: typeof p.price === 'number' ? p.price : Number(p.price) || 0,
      description: p.description || '',
      type: p.type,
      image: p.image,
      rating: typeof p.rating === 'number' ? p.rating : Number(p.rating) || 0,
      available: p.available ?? true,
      vendorId: vendorId,
      weight: p.weight != null ? (typeof p.weight === 'number' ? p.weight : Number(p.weight)) : null,
      carat: p.carat != null ? (typeof p.carat === 'number' ? p.carat : Number(p.carat)) : null,
    };
  });

  console.log('✅ Mapped products:', mapped.length);
  
  return mapped;
}

export async function fetchMyProducts(): Promise<Product[]> {
  const { data } = await api.get<ApiProduct[]>('/me/products');
  return data.map(p => ({
    id: p.id,
    name: p.name,
    price: p.price,
    description: p.description,
    type: p.type,
    image: p.image,
    rating: p.rating,
    available: p.available,
    vendorId: p.vendor_id,
    weight: p.weight,
    carat: p.carat,
  }));
}

export async function createProduct(productData: Omit<Product, 'id' | 'vendorId'>): Promise<Product> {
  const { data } = await api.post<ApiProduct>('/products', productData);
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description,
    type: data.type,
    image: data.image,
    rating: data.rating,
    available: data.available,
    vendorId: data.vendor_id,
    weight: data.weight,
    carat: data.carat,
  };
}

export async function updateProduct(id: number, productData: Partial<Omit<Product, 'id' | 'vendorId'>>): Promise<Product> {
  const { data } = await api.put<ApiProduct>(`/products/${id}`, productData);
  return {
    id: data.id,
    name: data.name,
    price: data.price,
    description: data.description,
    type: data.type,
    image: data.image,
    rating: data.rating,
    available: data.available,
    vendorId: data.vendor_id,
    weight: data.weight,
    carat: data.carat,
  };
}

export async function deleteProduct(id: number): Promise<void> {
  await api.delete(`/products/${id}`);
}

// Interface for API response that includes vendor
export interface ApiProductWithVendor extends ApiProduct {
  vendor?: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
    siret?: string | null;
    active: boolean;
  };
}

export interface ProductWithVendor extends Product {
  vendor?: {
    id: number;
    name: string;
    email: string;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
    siret?: string | null;
    active: boolean;
  };
}

export async function fetchProductById(id: string | number): Promise<ProductWithVendor> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Product not found');
    }
    throw new Error(`HTTP ${res.status}`);
  }

  const data: ApiProductWithVendor = await res.json();

  // Map API product to frontend format
  return {
    id: data.id,
    name: data.name,
    price: typeof data.price === 'number' ? data.price : Number(data.price) || 0,
    description: data.description,
    type: data.type,
    image: data.image,
    rating: typeof data.rating === 'number' ? data.rating : Number(data.rating) || 0,
    available: data.available ?? true,
    vendorId: data.vendor_id,
    weight: data.weight != null ? (typeof data.weight === 'number' ? data.weight : Number(data.weight)) : null,
    carat: data.carat != null ? (typeof data.carat === 'number' ? data.carat : Number(data.carat)) : null,
    vendor: data.vendor ? {
      id: data.vendor.id,
      name: data.vendor.name,
      email: data.vendor.email,
      phone: data.vendor.phone,
      address: data.vendor.address,
      company: data.vendor.company,
      siret: data.vendor.siret,
      active: data.vendor.active,
    } : undefined,
  };
}
