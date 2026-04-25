<?php
/**
 * DATABASE CONFIGURATION
 * Replace the placeholders with your actual Hostinger MySQL details
 */
$host = 'localhost'; // Usually 'localhost' on Hostinger
$db_name = 'u123456789_nexus'; // Your Hostinger Database Name
$username = 'u123456789_admin'; // Your Hostinger Database Username
$password = 'Your_Secret_Password'; // Your Hostinger Database Password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db_name;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Database Connection Error: ' . $e->getMessage(),
        'hint' => 'Check your credentials in api/db_config.php'
    ]);
    exit;
}
?>

