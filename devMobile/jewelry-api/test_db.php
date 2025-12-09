<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=3306;dbname=jewelry_shop', 'root', '');
    echo "PDO OK\n";
    echo "MySQL server version: " . $pdo->getAttribute(PDO::ATTR_SERVER_VERSION) . "\n";
} catch (PDOException $e) {
    echo "PDO ERROR: " . $e->getMessage() . "\n";
}
