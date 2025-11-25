# Frontend Logic Documentation - Jewelry React Native App

## 📱 Project Overview

This is a **React Native mobile application** built with **Expo** for a jewelry e-commerce platform. The app allows users to browse jewelry products, view gold prices, calculate ring/bracelet sizes, and includes role-based access for clients, vendors, and administrators.

**Tech Stack:**
- **Framework:** React Native 0.76.0 with Expo SDK 52
- **Language:** TypeScript
- **Navigation:** React Navigation (Stack + Bottom Tabs)
- **State Management:** React Context API (AuthContext)
- **Styling:** NativeWind (Tailwind CSS for React Native) + inline styles
- **Icons:** Lucide React Native
- **HTTP Client:** Axios
- **Storage:** AsyncStorage

---

## 🏗️ Project Structure

```
jewelry_rn_app_starter/
├── App.tsx                    # Main app entry, navigation setup
├── index.js                   # Expo entry point
├── app.json                   # Expo configuration
├── package.json               # Dependencies
├── tsconfig.json             # TypeScript config with path aliases
├── babel.config.js           # Babel config with module resolver
├── tailwind.config.js        # Tailwind/NativeWind config
│
├── src/
│   ├── components/
│   │   └── UI.tsx            # Reusable UI components (Text, Input, Button, Card)
│   │
│   ├── context/
│   │   └── AuthContext.tsx   # Authentication context provider
│   │
│   ├── data/
│   │   └── mockData.ts       # Mock products, vendors, and utility functions
│   │
│   ├── screens/
│   │   ├── HomeScreen.tsx              # Product browsing with filters
│   │   ├── ProductDetailScreen.tsx     # Product details and vendor info
│   │   ├── GoldPriceScreen.tsx         # Real-time gold price display with charts
│   │   ├── SizeCalculatorScreen.tsx    # Ring/bracelet size calculator
│   │   ├── AuthScreen.tsx              # Login/Register with role selection
│   │   ├── VendorDashboardScreen.tsx   # Vendor product management
│   │   ├── AdminDashboardScreen.tsx    # Admin analytics and vendor management
│   │   ├── ProductManagementScreen.tsx # Create/Edit products (stub)
│   │   └── VendorManagementScreen.tsx   # Manage vendors (stub)
│   │
│   └── services/
│       ├── api.ts            # Axios instance and auth token setup
│       ├── auth.ts           # Authentication API calls
│       └── products.ts       # Product API calls
│
└── assets/
    └── placeholder.png       # Placeholder image for products
```

---

## 🧭 Navigation Architecture

### Navigation Structure

The app uses a **hybrid navigation** pattern:
- **Bottom Tab Navigator** for main screens (Home, Gold Price, Size Calculator, Account)
- **Stack Navigator** for detail screens and role-specific dashboards

```
App (Stack Navigator)
├── MainTabs (Bottom Tab Navigator)
│   ├── Home
│   ├── GoldPrice
│   ├── SizeCalculator
│   └── Auth
│
└── Stack Screens (Modal/Full Screen)
    ├── ProductDetail
    ├── VendorDashboard
    ├── ProductManagement
    ├── AdminDashboard
    └── VendorManagement
```

### Navigation Types

**RootStackParamList:**
- `MainTabs`: undefined
- `ProductDetail`: { id: string }
- `VendorDashboard`: undefined
- `ProductManagement`: undefined
- `AdminDashboard`: undefined
- `VendorManagement`: undefined

**TabParamList:**
- `Home`: undefined
- `GoldPrice`: undefined
- `SizeCalculator`: undefined
- `Auth`: undefined

---

## 🔐 Authentication System

### AuthContext (`src/context/AuthContext.tsx`)

**Purpose:** Manages user authentication state across the app.

**Features:**
- Token-based authentication
- Persistent sessions using AsyncStorage
- Role-based access (client, vendor, admin)
- Automatic token restoration on app startup

**User Interface:**
```typescript
interface User {
  id: number;
  email: string;
  role: 'client' | 'vendor' | 'admin';
  vendorId?: number;  // Only for vendor role
}
```

**Context Methods:**
- `login(email, password, role?)`: Authenticates user and stores token
- `logout()`: Clears authentication state
- `user`: Current authenticated user (null if not logged in)
- `isAuthenticated`: Boolean flag
- `loading`: Initial auth state loading

**Storage Keys:**
- `auth_token`: JWT token
- `auth_user`: Serialized user object

**API Integration:**
- Uses `loginApi()` from `src/services/auth.ts`
- Sets auth token in Axios headers via `setAuthToken()`
- Currently configured for Laravel backend at `http://127.0.0.1:8000/api`

---

## 📺 Screen Details

### 1. HomeScreen (`src/screens/HomeScreen.tsx`)

**Purpose:** Main product browsing interface.

**Current Implementation:**
- Fetches products from API (`fetchProducts()`)
- Displays products in a list format
- Shows loading state and error handling
- Navigates to ProductDetail on tap

**Features:**
- Product list with images
- Product name, description, price
- Loading indicator
- Error state with retry button
- Empty state message

**Note:** There's a more complete version in the root directory (`HomeScreen.tsx`) with:
- Search functionality
- Category filtering (All, Rings, Necklaces, Bracelets, Earrings)
- Price range filters (min/max)
- Sorting options (Recommended, Price ↑/↓, Name A→Z/Z→A)
- Grid layout (2 columns)
- Filter modal

**Data Source:** `src/services/products.ts` → API endpoint `/api/products`

---

### 2. ProductDetailScreen (`src/screens/ProductDetailScreen.tsx`)

**Purpose:** Displays detailed product information and vendor contact.

**Features:**
- Large product image
- Product name, price, rating, availability status
- Full description
- Vendor information card:
  - Business name
  - Phone number
  - Email address
  - Physical address
- "Contact Vendor" button (placeholder)

**Data Source:** `src/data/mockData.ts` (uses `getProductById()` and `getVendorById()`)

**Navigation:** Back button to return to previous screen

---

### 3. GoldPriceScreen (`src/screens/GoldPriceScreen.tsx`)

**Purpose:** Displays real-time gold prices with historical charts.

**Features:**
- Current gold price display (EUR per gram)
- Price change indicator (trending up/down with percentage)
- Last update timestamp
- Interactive chart with SVG:
  - Day view (6 data points)
  - Week view (7 days)
  - Month view (4 weeks)
- Chart visualization with:
  - Line graph
  - Data points
  - Grid lines
  - X-axis labels (time)
  - Y-axis range (min/max)

**Data:** Currently uses mock data (`mockData` object in file)

**UI Components:**
- Period tabs (Jour/Semaine/Mois)
- Price card with gradient background
- SVG chart using `react-native-svg`
- Info card about currency

---

### 4. SizeCalculatorScreen (`src/screens/SizeCalculatorScreen.tsx`)

**Purpose:** Helps users find their ring or bracelet size.

**Features:**

**Ring Calculator:**
- Interactive slider for diameter (14-20mm)
- Visual ring preview (scaled circle)
- Size conversion table:
  - US sizes (3-10)
  - European sizes (44-62)
  - UK sizes (F-T)
- Real-time size calculation
- Complete size reference table

**Bracelet Calculator:**
- Interactive slider for wrist circumference (13-20cm)
- Visual bracelet preview
- Size categories: XS, S, M, L, XL
- Size descriptions (Très petit, Petit, Moyen, Grand, Très grand)
- Complete size reference table

**UI:**
- Tab switcher (Bague/Bracelet)
- Slider component (`@react-native-community/slider`)
- Visual previews
- Highlighted current size in tables

---

### 5. AuthScreen (`src/screens/AuthScreen.tsx`)

**Purpose:** User authentication and account management.

**Two States:**

**1. Not Authenticated:**
- Login/Register tab switcher
- Email and password inputs
- Role selection (Client, Vendeur, Admin)
- Additional fields for vendor registration:
  - Company name
  - SIRET number
- Submit button
- "Forgot password?" link (placeholder)

**2. Authenticated (Account View):**
- User profile card:
  - Email
  - Role badge with icon
  - Vendor ID (if vendor)
- Logout button
- Role-specific navigation buttons:
  - "Tableau de bord vendeur" (for vendors)
  - "Dashboard admin" (for admins)

**Authentication Flow:**
1. User enters credentials
2. Calls `login()` from AuthContext
3. AuthContext calls `loginApi()` from services
4. Token and user stored in AsyncStorage
5. Navigation based on role:
   - Vendor → VendorDashboard
   - Admin → AdminDashboard
   - Client → Home

---

### 6. VendorDashboardScreen (`src/screens/VendorDashboardScreen.tsx`)

**Purpose:** Vendor's product management dashboard.

**Access Control:** Only accessible to users with `role === 'vendor'`

**Features:**
- Header with vendor name
- Statistics cards:
  - Total products
  - Total views
  - Total contacts
- "Add Product" button → ProductManagement screen
- Product list with:
  - Product image thumbnail
  - Product name and description
  - Price
  - Availability badge
  - Action buttons:
    - View (navigate to ProductDetail)
    - Edit (navigate to ProductManagement)
    - Delete (placeholder)

**Data Source:** `src/data/mockData.ts` (uses `getProductsByVendor()`)

**Navigation Protection:** Redirects to Auth if user is not a vendor

---

### 7. AdminDashboardScreen (`src/screens/AdminDashboardScreen.tsx`)

**Purpose:** Administrative overview and analytics.

**Access Control:** Only accessible to users with `role === 'admin'`

**Features:**
- Header with platform overview
- Statistics cards:
  - Total vendors
  - Total products
  - Total transactions/contacts
- "Manage Vendors" button → VendorManagement screen
- Alert card for inactive vendors
- Usage trend chart (bar chart):
  - Monthly user growth
  - 6 months of data
- Product distribution chart:
  - Segmented bar showing product types
  - Percentage breakdown
  - Color-coded categories

**Data Source:** `src/data/mockData.ts`

**Navigation Protection:** Redirects to Auth if user is not an admin

---

### 8. ProductManagementScreen (`src/screens/ProductManagementScreen.tsx`)

**Status:** **STUB** - Placeholder screen

**Purpose:** Create, update, and delete products (for vendors).

**Current State:** Basic UI with placeholder text

**TODO:** Implement:
- Product form (name, description, price, type, image)
- Image upload
- Create/Update logic
- Delete confirmation
- API integration

---

### 9. VendorManagementScreen (`src/screens/VendorManagementScreen.tsx`)

**Status:** **STUB** - Placeholder screen

**Purpose:** Admin tool to manage vendors (add, remove, activate/deactivate).

**Current State:** Basic UI with placeholder text

**TODO:** Implement:
- Vendor list
- Add vendor form
- Activate/Deactivate toggle
- Delete vendor
- API integration

---

## 🔧 Services Layer

### API Service (`src/services/api.ts`)

**Purpose:** Centralized Axios configuration.

**Configuration:**
- Base URL: `http://127.0.0.1:8000/api`
- Timeout: 10 seconds
- Auth token management via `setAuthToken()`

**Functions:**
- `api`: Axios instance
- `setAuthToken(token?)`: Sets/removes Authorization header

**Note:** Currently configured for Laravel backend. Will need to be updated for Java backend.

---

### Auth Service (`src/services/auth.ts`)

**Purpose:** Authentication API calls.

**Types:**
```typescript
type Role = 'client' | 'vendor' | 'admin';

interface ApiUser {
  id: number;
  email: string;
  role: Role;
  vendorId?: number | null;
}

interface LoginResponse {
  user: ApiUser;
  token: string;
}
```

**Functions:**
- `loginApi(email, password)`: POST `/api/login` → returns LoginResponse
- `logoutApi()`: POST `/api/logout`

**Current Backend:** Laravel API

---

### Products Service (`src/services/products.ts`)

**Purpose:** Product-related API calls.

**Types:**
```typescript
type ProductType = 'bague' | 'bracelet' | 'collier' | 'boucles' | 'montre';

interface ApiProduct {
  id: number;
  name: string;
  price: number;
  description: string;
  type: ProductType;
  image: string | null;
  rating: number;
  available: boolean;
  vendor_id: number;  // snake_case from API
}

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  type: ProductType;
  image: string | null;
  rating: number;
  available: boolean;
  vendorId: number;   // camelCase for frontend
}
```

**Functions:**
- `fetchProducts()`: GET `/api/products` → returns Product[]

**Data Transformation:**
- Converts `vendor_id` (snake_case) to `vendorId` (camelCase)
- Handles HTTP errors

**Current Backend:** Laravel API at `http://127.0.0.1:8000/api`

---

## 📦 Data Layer

### Mock Data (`src/data/mockData.ts`)

**Purpose:** Provides mock data for development and fallback.

**Data:**
- `mockProducts`: Array of 6 sample products
- `mockVendors`: Array of 3 sample vendors

**Utility Functions:**
- `getVendorById(id)`: Find vendor by ID
- `getProductById(id)`: Find product by ID
- `getProductsByVendor(vendorId)`: Filter products by vendor

**Usage:**
- ProductDetailScreen uses mock data
- VendorDashboardScreen uses mock data
- AdminDashboardScreen uses mock data
- HomeScreen uses API (with fallback potential)

---

## 🎨 UI Components

### UI Component Library (`src/components/UI.tsx`)

**Purpose:** Reusable UI primitives.

**Components:**

1. **Text**
   - Wrapper around React Native `Text`
   - Default font size: 16
   - Supports className (NativeWind) and style props

2. **Input**
   - Wrapper around React Native `TextInput`
   - Default styling: border, padding, borderRadius
   - Forward ref support

3. **Button**
   - TouchableOpacity-based button
   - Default: black background, white text
   - Supports loading state (ActivityIndicator)
   - Disabled state

4. **Card**
   - Container with border and padding
   - Default: border, borderRadius, padding

**Styling Approach:**
- Inline styles (primary)
- NativeWind classes (optional, via className)
- Style prop override support

---

## 🔄 State Management

### Current Approach

**React Context API:**
- `AuthContext`: Global authentication state

**Local State (useState):**
- Each screen manages its own local state
- Form inputs, filters, UI toggles

**No Global State Library:**
- Zustand is installed but not used
- Could be added for product cart, favorites, etc.

---

## 🌐 API Integration Status

### Current State

**Backend:** Laravel PHP API (in `jewelry-api` folder)

**Endpoints Used:**
- `POST /api/login` - Authentication
- `GET /api/products` - Fetch products
- `POST /api/logout` - Logout (placeholder)

**Configuration:**
- Base URL: `http://127.0.0.1:8000/api`
- Auth: Bearer token in Authorization header

### Migration to Java Backend

**Required Changes:**

1. **Update API Base URL** (`src/services/api.ts`):
   ```typescript
   const BASE_URL = 'http://YOUR_JAVA_BACKEND_URL/api';
   ```

2. **Verify API Response Format:**
   - Ensure Java backend returns same structure:
     - Login: `{ user: {...}, token: "..." }`
     - Products: `[{ id, name, price, ... }]`

3. **Update Endpoints:**
   - Verify endpoint paths match Java backend
   - Update if different (e.g., `/auth/login` vs `/api/login`)

4. **Error Handling:**
   - Ensure error response format is compatible
   - Update error handling if needed

---

## 🎯 Key Features Summary

### ✅ Implemented

1. **Product Browsing**
   - Product list with images
   - Product detail view
   - Vendor information display

2. **Authentication**
   - Login/Register
   - Role-based access (client, vendor, admin)
   - Persistent sessions
   - Protected routes

3. **Gold Price Display**
   - Real-time price (mock)
   - Historical charts (day/week/month)
   - Price change indicators

4. **Size Calculator**
   - Ring size calculator (US/EU/UK)
   - Bracelet size calculator
   - Visual previews
   - Size reference tables

5. **Vendor Dashboard**
   - Product management UI
   - Statistics display
   - Product list with actions

6. **Admin Dashboard**
   - Platform statistics
   - Vendor management access
   - Analytics charts

### 🚧 Partially Implemented

1. **HomeScreen Filtering**
   - Basic version: API fetch only
   - Advanced version: Search, filters, sorting (in root `HomeScreen.tsx`)

2. **Product Management**
   - UI structure exists
   - API integration needed

3. **Vendor Management**
   - UI structure exists
   - API integration needed

### ❌ Not Implemented

1. **Shopping Cart**
2. **Checkout Process**
3. **Order History**
4. **Payment Integration**
5. **Image Upload**
6. **Push Notifications**
7. **Real-time Gold Price API**
8. **Product Reviews/Ratings**
9. **Wishlist/Favorites**
10. **Search Functionality** (in current HomeScreen)

---

## 🔗 Dependencies

### Core
- `expo`: ~52.0.0
- `react`: 18.3.1
- `react-native`: 0.76.0
- `typescript`: ^5.3.3

### Navigation
- `@react-navigation/native`: ^7.0.0
- `@react-navigation/native-stack`: ^7.0.0
- `@react-navigation/bottom-tabs`: ^7.8.4
- `react-native-screens`: ~4.9.0
- `react-native-safe-area-context`: ~4.13.1
- `react-native-gesture-handler`: ~2.20.2

### UI & Styling
- `nativewind`: ^4.0.36
- `tailwindcss`: ^3.4.12
- `lucide-react-native`: ^0.468.0
- `react-native-svg`: ^15.4.0

### Utilities
- `axios`: ^1.13.2
- `@react-native-async-storage/async-storage`: ^2.2.0
- `@react-native-community/slider`: 4.5.5
- `react-native-reanimated`: ~3.16.1
- `zustand`: ^4.5.4 (installed but not used)

---

## 🛠️ Development Notes

### Path Aliases

Configured in `tsconfig.json` and `babel.config.js`:
- `@/*` → `src/*`
- `@assets/*` → `assets/*`

**Usage:**
```typescript
import HomeScreen from '@/screens/HomeScreen';
import { useAuth } from '@/context/AuthContext';
```

### TypeScript Configuration

- Strict mode enabled
- Path mapping configured
- Expo base config extended

### Babel Configuration

- Expo preset
- Module resolver for path aliases
- Reanimated plugin (must be last)

---

## 📝 Next Steps for Backend Development

### 1. API Endpoints to Implement (Java Backend)

**Authentication:**
- `POST /api/login` - User login
- `POST /api/register` - User registration
- `POST /api/logout` - User logout
- `GET /api/user` - Get current user

**Products:**
- `GET /api/products` - List all products
- `GET /api/products/:id` - Get product details
- `POST /api/products` - Create product (vendor)
- `PUT /api/products/:id` - Update product (vendor)
- `DELETE /api/products/:id` - Delete product (vendor)

**Vendors:**
- `GET /api/vendors` - List vendors (admin)
- `GET /api/vendors/:id` - Get vendor details
- `POST /api/vendors` - Create vendor (admin)
- `PUT /api/vendors/:id` - Update vendor (admin)
- `DELETE /api/vendors/:id` - Delete vendor (admin)

**Gold Prices:**
- `GET /api/gold-prices` - Get current gold price
- `GET /api/gold-prices/history` - Get historical prices

### 2. Data Models

**User:**
- id, email, password (hashed), role, vendorId (nullable), createdAt, updatedAt

**Product:**
- id, name, description, price, type, image, rating, available, vendorId, createdAt, updatedAt

**Vendor:**
- id, name, email, phone, address, company, siret, active, userId, createdAt, updatedAt

**GoldPrice:**
- id, price, currency, timestamp

### 3. Security Considerations

- JWT token authentication
- Role-based access control (RBAC)
- Password hashing (BCrypt)
- Input validation
- SQL injection prevention
- CORS configuration for mobile app

### 4. Testing the Integration

1. Update API base URL in `src/services/api.ts`
2. Test login endpoint
3. Test product fetching
4. Verify token storage and restoration
5. Test protected routes
6. Test vendor/admin dashboards

---

## 🐛 Known Issues / TODOs

1. **HomeScreen Duplication:**
   - Two versions exist (root and src/screens)
   - Need to decide which to use or merge

2. **API Error Handling:**
   - Basic error handling exists
   - Could be improved with retry logic

3. **Image Loading:**
   - Uses placeholder for missing images
   - No image caching strategy

4. **Offline Support:**
   - No offline data caching
   - App requires network connection

5. **Form Validation:**
   - AuthScreen lacks client-side validation
   - No email format validation
   - No password strength requirements

6. **Loading States:**
   - Some screens lack loading indicators
   - Could improve UX with skeleton loaders

---

## 📚 Additional Resources

- **Expo Documentation:** https://docs.expo.dev/
- **React Navigation:** https://reactnavigation.org/
- **React Native:** https://reactnative.dev/
- **NativeWind:** https://www.nativewind.dev/
- **Lucide Icons:** https://lucide.dev/

---

**Last Updated:** Generated for backend development preparation
**Project Status:** Frontend complete, backend integration pending

