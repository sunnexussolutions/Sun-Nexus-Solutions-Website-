<?php
header('Content-Type: application/json');
$extensions = get_loaded_extensions();
$has_pdo_pgsql = in_array('pdo_pgsql', $extensions);
$has_pgsql = in_array('pgsql', $extensions);

echo json_encode([
    'php_version' => PHP_VERSION,
    'pdo_pgsql_available' => $has_pdo_pgsql,
    'pgsql_available' => $has_pgsql,
    'loaded_extensions' => $extensions
], JSON_PRETTY_PRINT);
?>
