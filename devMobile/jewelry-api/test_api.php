<?php
/**
 * Quick API Test Script
 * 
 * Run this to test if your API is working:
 * php test_api.php
 * 
 * Or access via browser: http://YOUR_IP:8000/test_api.php
 */

// Get your local IP (you'll need to update this)
$apiBaseUrl = 'http://192.168.110.124:8000/api'; // Update with your IP

echo "🧪 Testing Jewelry API\n";
echo "=====================\n\n";

// Test 1: Ping endpoint
echo "1. Testing /api/ping...\n";
$ch = curl_init($apiBaseUrl . '/ping');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    echo "   ✅ SUCCESS: $response\n\n";
} else {
    echo "   ❌ FAILED: HTTP $httpCode\n\n";
}

// Test 2: Get products
echo "2. Testing /api/products...\n";
$ch = curl_init($apiBaseUrl . '/products');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "   ✅ SUCCESS: Found " . count($data) . " products\n";
    if (count($data) > 0) {
        echo "   First product: " . $data[0]['name'] . "\n\n";
    }
} else {
    echo "   ❌ FAILED: HTTP $httpCode\n";
    echo "   Response: $response\n\n";
}

// Test 3: Login (if you have test user)
echo "3. Testing /api/login...\n";
$loginData = json_encode([
    'email' => 'vendor@test.com', // Update with your test user
    'password' => 'password123'     // Update with your test password
]);

$ch = curl_init($apiBaseUrl . '/login');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $loginData);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'Content-Length: ' . strlen($loginData)
]);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode === 200) {
    $data = json_decode($response, true);
    echo "   ✅ SUCCESS: Logged in as " . $data['user']['email'] . "\n";
    echo "   Token: " . substr($data['token'], 0, 20) . "...\n\n";
} else {
    echo "   ⚠️  SKIPPED: HTTP $httpCode (create test user first)\n\n";
}

echo "=====================\n";
echo "✅ API Test Complete!\n";
echo "\n";
echo "💡 Tips:\n";
echo "- Update \$apiBaseUrl with your actual IP\n";
echo "- Make sure Laravel server is running: php artisan serve --host=0.0.0.0 --port=8000\n";
echo "- Check database connection in .env file\n";
echo "- Run migrations: php artisan migrate\n";

