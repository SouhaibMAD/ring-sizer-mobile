# Backend Implementation Guide - Jewelry App

## 🔍 What Was The Problem?

**The Issue:** Public WiFi networks (like coffeeshops) often have **"Client Isolation"** enabled. This security feature prevents devices on the same network from communicating with each other directly. 

- Your phone couldn't reach your computer at `192.168.110.124:8081` (Expo dev server)
- Even though both were on the same WiFi network
- This is a common security measure on public networks

**The Solution:** Using your phone's **mobile hotspot** creates a private network without client isolation, allowing direct device-to-device communication.

---

## 📊 Current Implementation Status

### ✅ **Already Implemented:**

#### Backend (Laravel):
1. **Authentication** (`AuthController.php`)
   - ✅ `POST /api/login` - Working with database
   - ✅ `GET /api/me` - Get current user (protected)
   - ✅ `POST /api/logout` - Logout (protected)
   - ✅ Uses Laravel Sanctum for token authentication

2. **Database Structure:**
   - ✅ `users` table (with role: client/vendor/admin, vendor_id)
   - ✅ `products` table (name, price, description, type, image, rating, available, vendor_id)
   - ✅ `vendors` table (name, email, phone, address, company, siret, active)
   - ✅ Relationships: User → Vendor, Vendor → Products

3. **API Routes:**
   - ✅ `GET /api/ping` - Health check
   - ✅ `GET /api/products` - **BUT returns MOCK data** (not from DB)
   - ✅ `GET /api/products/{id}` - Uses database
   - ✅ `GET /api/vendors/{id}` - Uses database
   - ✅ `GET /api/vendors/{id}/products` - Uses database

#### Frontend (React Native):
1. **API Services:**
   - ✅ `src/services/api.ts` - Axios client with base URL
   - ✅ `src/services/auth.ts` - Login/logout functions
   - ✅ `src/services/products.ts` - Fetch products (but HomeScreen uses mock data)

2. **Screens:**
   - ✅ `HomeScreen.tsx` - Uses **mock data**, not API
   - ✅ `AuthScreen.tsx` - Uses API for login
   - ✅ `ProductDetailScreen.tsx` - Needs API integration
   - ⚠️ `ProductManagementScreen.tsx` - Empty, needs full implementation
   - ⚠️ `VendorDashboardScreen.tsx` - Uses mock data
   - ⚠️ `AdminDashboardScreen.tsx` - Uses mock data
   - ⚠️ `VendorManagementScreen.tsx` - Empty, needs implementation

---

## 🚀 Implementation Priority & Tasks

### **Phase 1: Connect Frontend to Database (HIGH PRIORITY)**

#### 1.1 Fix ProductController to Use Database
**File:** `devMobile/jewelry-api/app/Http/Controllers/ProductController.php`

**Current:** Returns mock data in `index()` method
**Task:** Replace with database query

```php
public function index()
{
    // Replace the mock data with:
    $products = Product::with('vendor')->get();
    
    return response()->json($products);
}
```

#### 1.2 Update HomeScreen to Use API
**File:** `devMobile/jewelry_rn_app_starter/src/screens/HomeScreen.tsx`

**Current:** Uses `mockProducts` from `@/data/mockData`
**Task:** Replace with API call

```typescript
// Add at top
import { fetchProducts } from '@/services/products';
import { useEffect, useState } from 'react';

// In component:
const [products, setProducts] = useState<Product[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchProducts();
      setProducts(data);
    } catch (error) {
      console.error('Failed to load products:', error);
      // Fallback to mock data on error
      setProducts(mockProducts as unknown as Product[]);
    } finally {
      setLoading(false);
    }
  };
  loadProducts();
}, []);

// Update useMemo to use products state instead of mockProducts
```

#### 1.3 Fix VendorController Missing Import
**File:** `devMobile/jewelry-api/app/Http/Controllers/VendorController.php`

**Current:** Uses `Vendor` class but doesn't import it
**Task:** Add import

```php
use App\Models\Vendor;
```

---

### **Phase 2: Product Management (VENDOR FEATURE)**

#### 2.1 Backend: Product CRUD Operations
**File:** `devMobile/jewelry-api/app/Http/Controllers/ProductController.php`

**Tasks:**
- ✅ `store()` - Create product (currently empty)
- ✅ `update()` - Update product (currently empty)
- ✅ `destroy()` - Delete product (currently empty)
- ✅ Add authorization: only vendor can manage their own products

**Implementation:**

```php
public function store(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'price' => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'type' => 'required|in:bague,bracelet,collier,boucles,montre',
        'image' => 'nullable|string',
        'rating' => 'nullable|numeric|min:0|max:5',
        'available' => 'boolean',
    ]);

    $user = $request->user();
    
    // Only vendors can create products
    if ($user->role !== 'vendor' || !$user->vendor_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $product = Product::create([
        'name' => $request->name,
        'price' => $request->price,
        'description' => $request->description,
        'type' => $request->type,
        'image' => $request->image,
        'rating' => $request->rating ?? 0,
        'available' => $request->available ?? true,
        'vendor_id' => $user->vendor_id,
    ]);

    return response()->json($product->load('vendor'), 201);
}

public function update(Request $request, string $id)
{
    $product = Product::findOrFail($id);
    $user = $request->user();

    // Only the product's vendor can update it
    if ($user->role !== 'vendor' || $product->vendor_id !== $user->vendor_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $request->validate([
        'name' => 'sometimes|string|max:255',
        'price' => 'sometimes|numeric|min:0',
        'description' => 'nullable|string',
        'type' => 'sometimes|in:bague,bracelet,collier,boucles,montre',
        'image' => 'nullable|string',
        'rating' => 'nullable|numeric|min:0|max:5',
        'available' => 'boolean',
    ]);

    $product->update($request->only([
        'name', 'price', 'description', 'type', 'image', 'rating', 'available'
    ]));

    return response()->json($product->load('vendor'));
}

public function destroy(string $id)
{
    $product = Product::findOrFail($id);
    $user = $request->user();

    // Only the product's vendor can delete it
    if ($user->role !== 'vendor' || $product->vendor_id !== $user->vendor_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $product->delete();

    return response()->json(['message' => 'Product deleted']);
}
```

#### 2.2 Backend: Add Routes
**File:** `devMobile/jewelry-api/routes/api.php`

**Add inside the `auth:sanctum` middleware group:**

```php
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Product management (vendor only)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
});
```

#### 2.3 Frontend: Product Management Service
**File:** `devMobile/jewelry_rn_app_starter/src/services/products.ts`

**Add functions:**

```typescript
export async function createProduct(productData: Omit<ApiProduct, 'id' | 'vendor_id'>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: ApiProduct = await res.json();
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
  };
}

export async function updateProduct(id: number, productData: Partial<ApiProduct>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
    body: JSON.stringify(productData),
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }

  const data: ApiProduct = await res.json();
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
  };
}

export async function deleteProduct(id: number): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${await getAuthToken()}`,
    },
  });

  if (!res.ok) {
    throw new Error(`HTTP ${res.status}`);
  }
}

// Helper to get auth token from AsyncStorage
async function getAuthToken(): Promise<string | null> {
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  return await AsyncStorage.getItem('auth_token');
}
```

#### 2.4 Frontend: Implement ProductManagementScreen
**File:** `devMobile/jewelry_rn_app_starter/src/screens/ProductManagementScreen.tsx`

**Full implementation needed** - Create form for:
- Product name, price, description
- Type selector (bague, bracelet, etc.)
- Image upload (later)
- Save/Update/Delete buttons

---

### **Phase 3: Vendor Dashboard (VENDOR FEATURE)**

#### 3.1 Backend: Get Vendor's Products
**File:** `devMobile/jewelry-api/app/Http/Controllers/ProductController.php`

**Add method:**

```php
public function myProducts(Request $request)
{
    $user = $request->user();
    
    if ($user->role !== 'vendor' || !$user->vendor_id) {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $products = Product::where('vendor_id', $user->vendor_id)
        ->with('vendor')
        ->get();

    return response()->json($products);
}
```

**Add route in `api.php`:**
```php
Route::middleware('auth:sanctum')->group(function () {
    // ...
    Route::get('/products/my', [ProductController::class, 'myProducts']);
});
```

#### 3.2 Frontend: Update VendorDashboardScreen
**File:** `devMobile/jewelry_rn_app_starter/src/screens/VendorDashboardScreen.tsx`

**Replace mock data with API call**

---

### **Phase 4: Admin Features**

#### 4.1 Backend: Admin Endpoints
**Files to create:**
- `devMobile/jewelry-api/app/Http/Controllers/AdminController.php`

**Endpoints needed:**
- `GET /api/admin/stats` - Platform statistics
- `GET /api/admin/vendors` - List all vendors
- `POST /api/admin/vendors` - Create vendor
- `PUT /api/admin/vendors/{id}` - Update vendor
- `DELETE /api/admin/vendors/{id}` - Delete/deactivate vendor

#### 4.2 Frontend: Admin Dashboard
**File:** `devMobile/jewelry_rn_app_starter/src/screens/AdminDashboardScreen.tsx`

**Replace mock data with API calls**

#### 4.3 Frontend: Vendor Management
**File:** `devMobile/jewelry_rn_app_starter/src/screens/VendorManagementScreen.tsx`

**Full implementation needed**

---

### **Phase 5: Additional Features**

#### 5.1 Product Detail Screen
**File:** `devMobile/jewelry_rn_app_starter/src/screens/ProductDetailScreen.tsx`

**Update to use API:**
```typescript
// Add API call to fetch product by ID
const fetchProductDetail = async (id: string) => {
  const res = await fetch(`${API_BASE_URL}/products/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return await res.json();
};
```

#### 5.2 Registration Endpoint
**File:** `devMobile/jewelry-api/app/Http/Controllers/AuthController.php`

**Add:**
```php
public function register(Request $request)
{
    $fields = $request->validate([
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:8',
        'role' => 'required|in:client,vendor,admin',
        'company' => 'required_if:role,vendor',
        'siret' => 'nullable|string',
    ]);

    $user = User::create([
        'email' => $fields['email'],
        'password' => Hash::make($fields['password']),
        'role' => $fields['role'],
    ]);

    // If vendor, create vendor record
    if ($fields['role'] === 'vendor') {
        $vendor = Vendor::create([
            'name' => $fields['company'],
            'email' => $fields['email'],
            'company' => $fields['company'],
            'siret' => $fields['siret'] ?? null,
        ]);
        $user->vendor_id = $vendor->id;
        $user->save();
    }

    $token = $user->createToken('mobile')->plainTextToken;

    return response()->json([
        'user' => [
            'id' => $user->id,
            'email' => $user->email,
            'role' => $user->role,
            'vendorId' => $user->vendor_id,
        ],
        'token' => $token,
    ], 201);
}
```

**Add route:**
```php
Route::post('/register', [AuthController::class, 'register']);
```

---

## 🧪 Testing Database Connection

### Step 1: Run Migrations
```bash
cd devMobile/jewelry-api
php artisan migrate
```

### Step 2: Seed Test Data (Optional)
Create a seeder or manually insert test data:

```bash
php artisan tinker
```

Then in tinker:
```php
// Create a vendor
$vendor = App\Models\Vendor::create([
    'name' => 'Test Vendor',
    'email' => 'vendor@test.com',
    'company' => 'Test Company',
    'active' => true,
]);

// Create a user
$user = App\Models\User::create([
    'email' => 'vendor@test.com',
    'password' => Hash::make('password123'),
    'role' => 'vendor',
    'vendor_id' => $vendor->id,
]);

// Create products
$product = App\Models\Product::create([
    'name' => 'Test Product',
    'price' => 100.00,
    'description' => 'Test description',
    'type' => 'bague',
    'rating' => 4.5,
    'available' => true,
    'vendor_id' => $vendor->id,
]);
```

### Step 3: Test API Endpoints

**Test from browser or Postman:**

1. **Health Check:**
   ```
   GET http://YOUR_IP:8000/api/ping
   ```

2. **Login:**
   ```
   POST http://YOUR_IP:8000/api/login
   Body: { "email": "vendor@test.com", "password": "password123" }
   ```

3. **Get Products (should return from DB after Phase 1):**
   ```
   GET http://YOUR_IP:8000/api/products
   ```

### Step 4: Test from Mobile App

1. Make sure both servers are running:
   - Laravel: `php artisan serve --host=0.0.0.0 --port=8000`
   - Expo: `npx expo start --clear`

2. Update API config with your hotspot IP:
   - Edit `src/config/apiConfig.ts`
   - Set `LOCAL_IP` to your computer's IP on hotspot network

3. Test in app:
   - Open app on phone
   - Try to login
   - Check if products load from database

---

## 📋 Implementation Checklist

### Immediate (Phase 1):
- [ ] Fix `ProductController::index()` to use database
- [ ] Fix `VendorController` missing import
- [ ] Update `HomeScreen.tsx` to use API instead of mock data
- [ ] Test products loading from database

### Short-term (Phase 2):
- [ ] Implement product CRUD in backend
- [ ] Add product management routes
- [ ] Create product management service in frontend
- [ ] Implement `ProductManagementScreen.tsx`
- [ ] Update `VendorDashboardScreen.tsx` to use API

### Medium-term (Phase 3-4):
- [ ] Implement admin endpoints
- [ ] Update admin dashboard screens
- [ ] Implement vendor management
- [ ] Add registration endpoint

### Long-term (Phase 5):
- [ ] Image upload functionality
- [ ] Search and filtering on backend
- [ ] Pagination for products
- [ ] Order management (if needed)
- [ ] Reviews/ratings system

---

## 🔧 File Structure Reference

### Backend Files:
```
devMobile/jewelry-api/
├── app/Http/Controllers/
│   ├── AuthController.php          ✅ Working
│   ├── ProductController.php        ⚠️ Needs DB integration
│   └── VendorController.php         ⚠️ Missing import
├── app/Models/
│   ├── User.php                     ✅ Ready
│   ├── Product.php                  ✅ Ready
│   └── Vendor.php                   ✅ Ready
├── routes/
│   └── api.php                      ⚠️ Needs product CRUD routes
└── database/migrations/             ✅ All created
```

### Frontend Files:
```
devMobile/jewelry_rn_app_starter/
├── src/
│   ├── services/
│   │   ├── api.ts                   ✅ Ready
│   │   ├── auth.ts                  ✅ Working
│   │   └── products.ts              ⚠️ Needs CRUD functions
│   ├── screens/
│   │   ├── HomeScreen.tsx           ⚠️ Uses mock data
│   │   ├── ProductDetailScreen.tsx  ⚠️ Needs API
│   │   ├── ProductManagementScreen.tsx  ❌ Empty
│   │   ├── VendorDashboardScreen.tsx    ⚠️ Uses mock data
│   │   ├── AdminDashboardScreen.tsx     ⚠️ Uses mock data
│   │   └── VendorManagementScreen.tsx  ❌ Empty
│   └── config/
│       └── apiConfig.ts             ✅ Ready
```

---

## 🚨 Common Issues & Solutions

### Issue: CORS Errors
**Solution:** Add CORS middleware in Laravel
```bash
php artisan make:middleware CorsMiddleware
```
Then configure in `bootstrap/app.php` or use `fruitcake/laravel-cors` package.

### Issue: Token Not Working
**Solution:** Check Sanctum configuration in `config/sanctum.php` and ensure `APP_URL` is set correctly.

### Issue: Database Connection Failed
**Solution:** Check `.env` file database credentials and run migrations.

---

## 📞 Next Steps

1. **Start with Phase 1** - Get products loading from database
2. **Test thoroughly** - Use Postman/curl to test API endpoints
3. **Update frontend** - Connect screens to real API
4. **Add error handling** - Handle network errors gracefully
5. **Add loading states** - Show spinners while data loads

Good luck! 🚀

