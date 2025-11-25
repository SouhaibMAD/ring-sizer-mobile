# Quick Test Guide - Database Connection

## ✅ What I Just Fixed:

1. **ProductController** - Now uses database instead of mock data
2. **VendorController** - Fixed missing import

## 🧪 How to Test Database Connection:

### Step 1: Make Sure Database is Set Up

```bash
cd devMobile/jewelry-api
php artisan migrate
```

### Step 2: Create Test Data

**Option A: Using Tinker (Recommended)**
```bash
php artisan tinker
```

Then paste this:
```php
// Create vendor
$vendor = App\Models\Vendor::create([
    'name' => 'Test Jewelry Store',
    'email' => 'vendor@test.com',
    'company' => 'Test Company',
    'phone' => '1234567890',
    'active' => true,
]);

// Create user
$user = App\Models\User::create([
    'email' => 'vendor@test.com',
    'password' => Hash::make('password123'),
    'role' => 'vendor',
    'vendor_id' => $vendor->id,
]);

// Create products
App\Models\Product::create([
    'name' => 'Bague Diamant Solitaire',
    'price' => 2500.00,
    'description' => 'Magnifique bague en or blanc 18 carats avec diamant solitaire de 0.5 carat.',
    'type' => 'bague',
    'rating' => 4.8,
    'available' => true,
    'vendor_id' => $vendor->id,
]);

App\Models\Product::create([
    'name' => 'Bracelet Or Rose',
    'price' => 1800.00,
    'description' => 'Bracelet élégant en or rose 18 carats.',
    'type' => 'bracelet',
    'rating' => 4.5,
    'available' => true,
    'vendor_id' => $vendor->id,
]);

App\Models\Product::create([
    'name' => 'Collier Perles',
    'price' => 1200.00,
    'description' => 'Collier en perles naturelles.',
    'type' => 'collier',
    'rating' => 4.7,
    'available' => true,
    'vendor_id' => $vendor->id,
]);
```

**Option B: Create a Seeder**
```bash
php artisan make:seeder TestDataSeeder
```

### Step 3: Test API Endpoints

**1. Test Ping (should work immediately):**
```bash
curl http://YOUR_HOTSPOT_IP:8000/api/ping
```

**2. Test Products (should return from database now):**
```bash
curl http://YOUR_HOTSPOT_IP:8000/api/products
```

**3. Test Login:**
```bash
curl -X POST http://YOUR_HOTSPOT_IP:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@test.com","password":"password123"}'
```

### Step 4: Test from Mobile App

1. **Make sure both servers are running:**
   - Laravel: `php artisan serve --host=0.0.0.0 --port=8000`
   - Expo: `npx expo start --clear`

2. **Update API config with your hotspot IP:**
   - Edit `devMobile/jewelry_rn_app_starter/src/config/apiConfig.ts`
   - Set `LOCAL_IP` to your computer's IP on the hotspot network
   - Find IP: `ipconfig` (look for hotspot adapter)

3. **Test in app:**
   - Open app on phone
   - Go to Home screen - products should load from database
   - Try login with: `vendor@test.com` / `password123`

## 🔍 Verify It's Working:

### Check Backend Logs:
When you load products in the app, you should see database queries in Laravel logs:
```bash
tail -f storage/logs/laravel.log
```

### Check Network Tab:
In Expo Go, shake your phone → "Show Developer Menu" → "Debug Remote JS"
Then check browser console for network requests.

## ⚠️ Common Issues:

### Issue: "No products showing"
**Check:**
- Database has products: `php artisan tinker` → `Product::count()`
- API returns data: `curl http://YOUR_IP:8000/api/products`
- Frontend API config has correct IP

### Issue: "CORS error"
**Fix:** Add to `bootstrap/app.php`:
```php
->withMiddleware(function (Middleware $middleware) {
    $middleware->api(prepend: [
        \Illuminate\Http\Middleware\HandleCors::class,
    ]);
})
```

### Issue: "Connection refused"
**Check:**
- Laravel server is running: `php artisan serve --host=0.0.0.0 --port=8000`
- Firewall allows port 8000
- IP address is correct in `apiConfig.ts`

## 📊 Expected Results:

✅ **Products endpoint** should return JSON array of products from database
✅ **Login** should return user object + token
✅ **HomeScreen** should display products from API (after you update it)

## 🚀 Next Steps:

After confirming database connection works:
1. Update `HomeScreen.tsx` to use API (see BACKEND_IMPLEMENTATION_GUIDE.md)
2. Implement product CRUD operations
3. Connect other screens to API

---

**Need Help?** Check `BACKEND_IMPLEMENTATION_GUIDE.md` for detailed implementation steps!

