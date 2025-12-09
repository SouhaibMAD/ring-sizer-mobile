<?php
require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Product;

$p = Product::with('vendor')->find(6);

echo "Product 6 Details:\n";
echo str_repeat("=", 60) . "\n";
echo "ID: {$p->id}\n";
echo "Name: {$p->name}\n";
echo "Type: {$p->type}\n";
echo "Price: {$p->price}\n";
echo "Description: " . ($p->description ?? 'NULL') . "\n";
echo "Image: " . ($p->image ?? 'NULL') . "\n";
echo "Rating: {$p->rating}\n";
echo "Available: " . ($p->available ? 'Yes' : 'No') . "\n";
echo "Vendor ID: {$p->vendor_id}\n";
echo "Has Vendor: " . ($p->vendor ? 'Yes' : 'No') . "\n";
if ($p->vendor) {
    echo "Vendor Name: {$p->vendor->name}\n";
}

echo "\nJSON representation:\n";
echo json_encode($p, JSON_PRETTY_PRINT) . "\n";

