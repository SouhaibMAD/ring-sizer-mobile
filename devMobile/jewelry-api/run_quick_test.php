<?php
/**
 * Quick API Test Script
 * 
 * This script tests all API endpoints to verify database connection
 * 
 * Make sure Laravel server is running:
 * php artisan serve --host=0.0.0.0 --port=8000
 */

echo "🧪 QUICK API TEST\n";
echo "================\n\n";

// Get your local IP (update this with your hotspot IP)
$apiBaseUrl = 'http://127.0.0.1:8000/api';

// Colors for output
$green = "\033[32m";
$red = "\033[31m";
$yellow = "\033[33m";
$reset = "\033[0m";

// Test 1: Ping endpoint
echo "1️⃣  Testing /api/ping...\n";
$ch = curl_init($apiBaseUrl . '/ping');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$error = curl_error($ch);
curl_close($ch);

if ($httpCode === 200) {
    echo "   {$green}✅ SUCCESS{$reset}: $response\n\n";
} else {
    if ($error) {
        echo "   {$red}❌ CONNECTION FAILED{$reset}: $error\n";
        echo "   {$yellow}💡 Make sure Laravel server is running:{$reset}\n";
        echo "      php artisan serve --host=0.0.0.0 --port=8000\n\n";
        exit(1);
    } else {
        echo "   {$red}❌ FAILED{$reset}: HTTP $httpCode\n\n";
    }
}

// Test 2: Get products
echo "2️⃣  Testing /api/products...\n";
$ch = curl_init($apiBaseUrl . '/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    $count = is_array($data) ? count($data) : 0;
    echo "   {$green}✅ SUCCESS{$reset}: Found $count products\n";
    if ($count > 0) {
        echo "   First product: {$green}{$data[0]['name']}{$reset} (€{$data[0]['price']})\n";
        echo "   Type: {$data[0]['type']}, Vendor ID: {$data[0]['vendor_id']}\n\n";
    } else {
        echo "   {$yellow}⚠️  No products in database{$reset}\n";
        echo "   Run: php seed_test_data.php\n\n";
    }
} else {
    echo "   {$red}❌ FAILED{$reset}: HTTP $httpCode\n";
    echo "   Response: $response\n\n";
}

// Test 3: Login
echo "3️⃣  Testing /api/login...\n";
$loginData = json_encode([
    'email' => 'vendor@test.com',
    'password' => 'password123'
]);

$ch = curl_init($apiBaseUrl . '/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($loginData)
]);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "   {$green}✅ SUCCESS{$reset}: Logged in as {$data['user']['email']}\n";
    echo "   Role: {$data['user']['role']}, Vendor ID: {$data['user']['vendorId']}\n";
    echo "   Token: " . substr($data['token'], 0, 30) . "...\n\n";
} else {
    $error = json_decode($response, true);
    echo "   {$red}❌ FAILED{$reset}: HTTP $httpCode\n";
    echo "   Message: " . ($error['message'] ?? $response) . "\n\n";
}

// Test 4: Get single product
echo "4️⃣  Testing /api/products/1...\n";
$ch = curl_init($apiBaseUrl . '/products/1');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 5);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "   {$green}✅ SUCCESS{$reset}: Product found\n";
    echo "   Name: {$data['name']}, Price: €{$data['price']}\n\n";
} else {
    echo "   {$red}❌ FAILED{$reset}: HTTP $httpCode\n\n";
}

// Summary
echo "================\n";
echo "{$green}✅ API TEST COMPLETE!{$reset}\n\n";

echo "📱 Next Steps:\n";
echo "1. Update API config in frontend:\n";
echo "   Edit: devMobile/jewelry_rn_app_starter/src/config/apiConfig.ts\n";
echo "   Set LOCAL_IP to your hotspot IP address\n\n";
echo "2. Start Expo server:\n";
echo "   cd devMobile/jewelry_rn_app_starter\n";
echo "   npx expo start --clear\n\n";
echo "3. Test in mobile app:\n";
echo "   - Login with: vendor@test.com / password123\n";
echo "   - Check if products load from database\n\n";

