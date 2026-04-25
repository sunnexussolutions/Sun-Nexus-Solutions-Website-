<?php
/**
 * SETUP CHECKER
 * Visit this file in your browser (e.g., yoursite.com/api/check_setup.php)
 * to verify your Hostinger configuration.
 */
header('Content-Type: application/json');

$response = [
    'php_version' => PHP_VERSION,
    'pdo_mysql_installed' => extension_loaded('pdo_mysql'),
    'database' => [
        'connected' => false,
        'message' => '',
        'users_table_exists' => false,
        'has_admin_user' => false
    ]
];

try {
    require_once 'db_config.php';
    $response['database']['connected'] = true;

    // Check tables
    $stmt = $pdo->query("SHOW TABLES LIKE 'users'");
    if ($stmt->fetch()) {
        $response['database']['users_table_exists'] = true;
        
        // Check for admin user
        $stmt = $pdo->query("SELECT COUNT(*) FROM users WHERE username = 'admin@nexus'");
        if ($stmt->fetchColumn() > 0) {
            $response['database']['has_admin_user'] = true;
        }
    } else {
        $response['database']['message'] = "Table 'users' NOT found. Please run the SQL setup script.";
    }

} catch (Exception $e) {
    $response['database']['connected'] = false;
    $response['database']['message'] = $e->getMessage();
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
