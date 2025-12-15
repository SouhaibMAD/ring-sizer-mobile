// src/services/products.ts


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
}

import { API_BASE_URL } from '../config/apiConfig';

const API_PORT = 8000;

export async function fetchProducts(): Promise<Product[]> {
  const url = `${API_BASE_URL}/products`;
  console.log(`📡 Fetching products from: ${url}`);
  
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    });

    console.log(`📡 Response status: ${res.status} ${res.statusText}`);

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`❌ API Error: ${res.status} - ${errorText}`);
      throw new Error(`HTTP ${res.status}: ${errorText || res.statusText}`);
    }

    const data: any[] = await res.json();

    // Debug: Log raw API response
    console.log('📦 Raw API products:', data.length);
    console.log('📦 First product sample:', JSON.stringify(data[0], null, 2));
    
    data.forEach((p, index) => {
      console.log(`  [${index + 1}] ID: ${p.id}, Name: ${p.name}, Type: ${p.type}, Vendor ID: ${p.vendor_id || p.vendor?.id || 'MISSING'}`);
    });

    // On mappe vendor_id → vendorId pour ton front
    // Handle both formats: direct vendor_id or nested vendor relationship
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
      };
    });

    console.log('✅ Mapped products:', mapped.length);
    
    return mapped;
  } catch (error: any) {
    console.error('❌ Network error fetching products:', error);
    if (error.message?.includes('Network request failed') || error.message?.includes('Failed to fetch')) {
      throw new Error(`Cannot connect to API at ${url}. Make sure the Laravel server is running on port ${API_PORT} and accessible from your device/emulator.`);
    }
    throw error;
  }
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
