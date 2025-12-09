// ✅ Interfaces
export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'bague' | 'bracelet' | 'collier' | 'boucles' | 'montre';
  image: string;
  rating: number;
  available: boolean;
  vendorId: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
  siret: string;
  active: boolean;
}

export interface User {
  id: string;
  email: string;
  role: 'client' | 'vendor' | 'admin';
  vendorId?: string;
}

// ✅ Mock data
export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Bijouterie Élégance',
    email: 'contact@elegance.fr',
    phone: '+33 1 23 45 67 89',
    address: '123 Rue de la Paix, 75001 Paris',
    company: 'Élégance SARL',
    siret: '123 456 789 00012',
    active: true
  },
  {
    id: 'v2',
    name: 'Or & Diamants',
    email: 'info@ordiamants.fr',
    phone: '+33 1 98 76 54 32',
    address: '45 Avenue Montaigne, 75008 Paris',
    company: 'Or & Diamants SAS',
    siret: '987 654 321 00023',
    active: true
  },
  {
    id: 'v3',
    name: 'Joaillerie Prestige',
    email: 'service@prestige.fr',
    phone: '+33 1 55 44 33 22',
    address: '78 Boulevard Haussmann, 75009 Paris',
    company: 'Prestige SA',
    siret: '456 789 123 00034',
    active: false
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Bague Diamant Solitaire',
    price: 2500,
    description: "Magnifique bague en or blanc 18 carats avec diamant solitaire de 0.5 carat. Certificat d'authenticité inclus.",
    type: 'bague',
    image: 'https://images.unsplash.com/photo-1758995116142-c626a962a682?auto=format&fit=crop&w=1080&q=80',
    rating: 4.8,
    available: true,
    vendorId: 'v1'
  },
  {
    id: '2',
    name: 'Bracelet Or Rose',
    price: 1800,
    description: "Bracelet élégant en or rose 18 carats avec maillons fins. Design contemporain et intemporel.",
    type: 'bracelet',
    image: 'https://images.unsplash.com/photo-1655707063513-a08dad26440e?auto=format&fit=crop&w=1080&q=80',
    rating: 4.5,
    available: true,
    vendorId: 'v1'
  },
  {
    id: '3',
    name: 'Collier Perles Diamants',
    price: 3200,
    description: 'Collier sophistiqué avec perles naturelles et diamants. Or blanc 18 carats. Pièce unique.',
    type: 'collier',
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?auto=format&fit=crop&w=1080&q=80',
    rating: 4.9,
    available: true,
    vendorId: 'v2'
  },
  {
    id: '4',
    name: "Boucles d'Oreilles Or",
    price: 890,
    description: "Boucles d'oreilles créoles en or jaune 18 carats. Design moderne et élégant.",
    type: 'boucles',
    image: 'https://images.unsplash.com/photo-1684439673104-f5d22791c71a?auto=format&fit=crop&w=1080&q=80',
    rating: 4.6,
    available: true,
    vendorId: 'v1'
  },
  {
    id: '5',
    name: 'Montre Luxe Or',
    price: 8500,
    description: 'Montre de luxe en or jaune massif avec mécanisme automatique suisse. Édition limitée.',
    type: 'montre',
    image: 'https://images.unsplash.com/photo-1670177257750-9b47927f68eb?auto=format&fit=crop&w=1080&q=80',
    rating: 5.0,
    available: true,
    vendorId: 'v2'
  },
  {
    id: '6',
    name: 'Bague Alliance Or Blanc',
    price: 1200,
    description: 'Alliance classique en or blanc 18 carats. Finition polie brillante.',
    type: 'bague',
    image: 'https://images.unsplash.com/photo-1758995116142-c626a962a682?auto=format&fit=crop&w=1080&q=80',
    rating: 4.7,
    available: true,
    vendorId: 'v1'
  }
];

// ✅ Fonctions utilitaires
export const getVendorById = (id: string): Vendor | undefined =>
  mockVendors.find(v => v.id === id);

export const getProductById = (id: string): Product | undefined =>
  mockProducts.find(p => p.id === id);

export const getProductsByVendor = (vendorId: string): Product[] =>
  mockProducts.filter(p => p.vendorId === vendorId);
