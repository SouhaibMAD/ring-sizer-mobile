<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;

echo "📦 Products in Database:\n";
echo str_repeat("=", 60) . "\n";

$products = Product::all();

foreach ($products as $p) {
    echo sprintf(
        "ID: %-3d | Name: %-30s | Type: %-10s | Available: %s | Price: %s\n",
        $p->id,
        substr($p->name, 0, 30),
        $p->type ?? 'NULL',
        $p->available ? 'Yes' : 'No',
        $p->price ?? 'NULL'
    );
}

echo str_repeat("=", 60) . "\n";
echo "Total: " . $products->count() . " products\n\n";

// Check for products with missing vendor
$productsWithoutVendor = Product::whereNull('vendor_id')->orWhere('vendor_id', 0)->get();
if ($productsWithoutVendor->count() > 0) {
    echo "⚠️  Products without vendor: " . $productsWithoutVendor->count() . "\n";
    foreach ($productsWithoutVendor as $p) {
        echo "  - ID {$p->id}: {$p->name}\n";
    }
}

// Check for products with invalid type
$validTypes = ['bague', 'bracelet', 'collier', 'boucles', 'montre'];
$invalidTypes = Product::whereNotIn('type', $validTypes)->get();
if ($invalidTypes->count() > 0) {
    echo "\n⚠️  Products with invalid type: " . $invalidTypes->count() . "\n";
    foreach ($invalidTypes as $p) {
        echo "  - ID {$p->id}: {$p->name} (type: " . ($p->type ?? 'NULL') . ")\n";
    }
}

