<?php
/**
 * CONTACT FORM HANDLER — NEON DB (PostgreSQL)
 */
ini_set('display_errors', 0);
error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Global error handler to catch non-exception errors
register_shutdown_function(function() {
    $error = error_get_last();
    if ($error !== NULL && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
        echo json_encode([
            'success' => false,
            'message' => 'Fatal Protocol Error: ' . $error['message'] . ' in ' . $error['file'] . ' on line ' . $error['line']
        ]);
    }
});

require_once 'db_config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if (!$data) {
        echo json_encode(['success' => false, 'message' => 'Invalid data transmitted.']);
        exit;
    }

    $name = trim($data['name'] ?? '');
    $email = trim($data['email'] ?? '');
    $academic_year = trim($data['academic_year'] ?? '');
    $graduation_year = trim($data['graduation_year'] ?? '');
    $branch = trim($data['branch'] ?? '');
    $other_branch = trim($data['other_branch'] ?? '');
    
    // Optional/Conditional fields
    $specialization = trim($data['specialization'] ?? '');
    $skills = trim($data['skills'] ?? '');
    $domain = trim($data['domain'] ?? '');
    $projects = trim($data['projects'] ?? '');
    $github = trim($data['github'] ?? '');
    $linkedin = trim($data['linkedin'] ?? '');
    $codechef = trim($data['codechef'] ?? '');
    $hackerrank = trim($data['hackerrank'] ?? '');
    $languages = trim($data['languages'] ?? '');

    // Basic Validation
    if (empty($name) || empty($email) || empty($academic_year) || empty($graduation_year) || empty($branch)) {
        echo json_encode(['success' => false, 'message' => 'Core identification fields are required.']);
        exit;
    }

    // Use other_branch if branch is 'Other'
    $final_branch = ($branch === 'Other') ? $other_branch : $branch;

    try {
        // Evolve table schema for full technical profile
        $pdo->exec("CREATE TABLE IF NOT EXISTS contact_inquiries (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            academic_year VARCHAR(50) NOT NULL,
            graduation_year VARCHAR(50) NOT NULL,
            branch VARCHAR(255) NOT NULL,
            specialization VARCHAR(100),
            skills TEXT,
            domain VARCHAR(100),
            projects TEXT,
            github VARCHAR(255),
            linkedin VARCHAR(255),
            codechef VARCHAR(255),
            hackerrank VARCHAR(255),
            languages VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )");

        // Insert comprehensive profile
        $sql = "INSERT INTO contact_inquiries 
                (name, email, academic_year, graduation_year, branch, specialization, skills, domain, projects, github, linkedin, codechef, hackerrank, languages) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            $name, $email, $academic_year, $graduation_year, $final_branch, 
            $specialization, $skills, $domain, $projects, 
            $github, $linkedin, $codechef, $hackerrank, $languages
        ]);

        echo json_encode([
            'success' => true, 
            'message' => 'Technical Profile Secured! Welcome to the Nexus ecosystem.',
            'profile_id' => $pdo->lastInsertId()
        ]);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false, 
            'message' => 'Protocol Error: Could not secure data in Neon DB. ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Method Not Allowed.']);
}
?>
