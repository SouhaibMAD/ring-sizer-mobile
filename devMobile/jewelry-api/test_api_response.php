<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;

echo "🔍 Testing API Response Format:\n";
echo str_repeat("=", 60) . "\n\n";

$products = Product::with('vendor')->get();

echo "Total products: " . $products->count() . "\n\n";

foreach ($products as $p) {
    echo "Product ID: {$p->id}\n";
    echo "  Name: {$p->name}\n";
    echo "  Type: " . ($p->type ?? 'NULL') . "\n";
    echo "  Price: " . ($p->price ?? 'NULL') . "\n";
    echo "  Available: " . ($p->available ? 'Yes' : 'No') . "\n";
    echo "  Vendor ID: " . ($p->vendor_id ?? 'NULL') . "\n";
    echo "  Has Vendor: " . ($p->vendor ? 'Yes' : 'No') . "\n";
    
    if ($p->vendor) {
        echo "  Vendor Name: {$p->vendor->name}\n";
    } else {
        echo "  ⚠️  NO VENDOR - This might cause issues!\n";
    }
    
    // Check if this would be filtered out
    $validTypes = ['bague', 'bracelet', 'collier', 'boucles', 'montre'];
    if (!in_array($p->type, $validTypes)) {
        echo "  ⚠️  INVALID TYPE - Will not map to category!\n";
    }
    
    echo "\n";
}

