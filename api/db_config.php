<?php
/**
 * DATABASE CONFIGURATION — NEON DB (PostgreSQL)
 */
$host = 'ep-crimson-mouse-apqu5ds3.c-7.us-east-1.aws.neon.tech';
$db_name = 'neondb';
$username = 'neondb_owner';
$password = 'npg_aUrtH17eWAbn';
$port = '5432';

try {
    // Neon DB requires SSL for PostgreSQL connections
    $dsn = "pgsql:host=$host;port=$port;dbname=$db_name;sslmode=require";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false, 
        'message' => 'Neon DB Connection Error: ' . $e->getMessage()
    ]);
    exit;
}
?>

