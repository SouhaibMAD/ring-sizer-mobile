<?php
/**
 * Quick Test Data Seeder
 * Run: php seed_test_data.php
 */

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Vendor;
use App\Models\User;
use App\Models\Product;
use Illuminate\Support\Facades\Hash;
/*
echo "🌱 Seeding test data...\n\n";

// Create vendor
$vendor = Vendor::create([
    'name' => 'Test Jewelry Store',
    'email' => 'vendor@test.com',
    'company' => 'Test Company',
    'phone' => '1234567890',
    'active' => true,
]);
echo "✅ Vendor created: {$vendor->name} (ID: {$vendor->id})\n";

// Create user
$user = User::create([
    'name' => 'Test Vendor',
    'email' => 'vendor@test.com',
    'password' => Hash::make('password123'),
    'role' => 'vendor',
    'vendor_id' => $vendor->id,
]);
echo "✅ User created: {$user->email} (Role: {$user->role})\n";

// Create products
$products = [
    [
        'name' => 'Bague Diamant Solitaire',
        'price' => 2500.00,
        'description' => 'Magnifique bague en or blanc 18 carats avec diamant solitaire de 0.5 carat.',
        'type' => 'bague',
        'rating' => 4.8,
        'available' => true,
        'vendor_id' => $vendor->id,
    ],
    [
        'name' => 'Bracelet Or Rose',
        'price' => 1800.00,
        'description' => 'Bracelet élégant en or rose 18 carats.',
        'type' => 'bracelet',
        'rating' => 4.5,
        'available' => true,
        'vendor_id' => $vendor->id,
    ],
    [
        'name' => 'Collier Perles Naturelles',
        'price' => 1200.00,
        'description' => 'Collier en perles naturelles de qualité supérieure.',
        'type' => 'collier',
        'rating' => 4.7,
        'available' => true,
        'vendor_id' => $vendor->id,
    ],
    [
        'name' => 'Boucles d\'Oreilles Diamant',
        'price' => 950.00,
        'description' => 'Boucles d\'oreilles en or blanc avec diamants.',
        'type' => 'boucles',
        'rating' => 4.6,
        'available' => true,
        'vendor_id' => $vendor->id,
    ],
    [
        'name' => 'Montre Or Classique',
        'price' => 3200.00,
        'description' => 'Montre de luxe en or 18 carats, mouvement suisse.',
        'type' => 'montre',
        'rating' => 4.9,
        'available' => true,
        'vendor_id' => $vendor->id,
    ],
];

foreach ($products as $productData) {
    $product = Product::create($productData);
    echo "✅ Product created: {$product->name} (€{$product->price})\n";
}

echo "\n📊 Summary:\n";
echo "   Vendors: " . Vendor::count() . "\n";
echo "   Users: " . User::count() . "\n";
echo "   Products: " . Product::count() . "\n";

echo "\n✅ Test data seeded successfully!\n";
echo "\n💡 Login credentials:\n";
echo "   Email: vendor@test.com\n";
echo "   Password: password123\n";

*/
/*
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

// Now you can use User::create(...)
$user = User::create([
    'name' => 'safioio',
    'email' => 'safioio@test.com',
    'password' => Hash::make('safioio123'),
    'role' => 'client',
]);

echo "✅ User created: {$user->email} (Role: {$user->role})\n";
*/


$product = Product::create([
    'name' => 'forsa w monasaba',
    'price' => 5000.00,
    'description' => 'diamond lmliiii7',
    'type' => 'bracelet',
    'rating' => 5.0,
    'available' => true,
    'vendor_id' => 3,
]);
echo "✅ Product created: {$product->name} (€{$product->price})\n";