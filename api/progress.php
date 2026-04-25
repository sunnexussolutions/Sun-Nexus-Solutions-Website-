<?php
/**
 * PROGRESS & STATS API
 * Handles saving and loading of user performance data
 */
header('Content-Type: application/json');
require_once 'db_config.php';

session_start();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Unauthorized']);
    exit;
}

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Fetch User Stats
        $stmt = $pdo->prepare("SELECT streak, hours, quiz_points as quizPoints, last_active as lastActive FROM users WHERE id = ?");
        $stmt->execute([$user_id]);
        $stats = $stmt->fetch();

        // Fetch Course Progress
        $stmt = $pdo->prepare("SELECT course_id, progress FROM course_progress WHERE user_id = ?");
        $stmt->execute([$user_id]);
        $progressRows = $stmt->fetchAll();
        
        $progress = [];
        foreach ($progressRows as $row) {
            $progress[$row['course_id']] = (int)$row['progress'];
        }

        echo json_encode([
            'success' => true,
            'stats' => $stats,
            'progress' => $progress
        ]);
    } catch (PDOException $e) {
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $pdo->beginTransaction();

        // Update Stats if provided
        if (isset($data['stats'])) {
            $stats = $data['stats'];
            $stmt = $pdo->prepare("UPDATE users SET streak = ?, hours = ?, quiz_points = ?, last_active = ? WHERE id = ?");
            $stmt->execute([
                $stats['streak'] ?? 0,
                $stats['hours'] ?? 0,
                $stats['quizPoints'] ?? 0,
                $stats['lastActive'] ?? date('Y-m-d'),
                $user_id
            ]);
        }

        // Update Course Progress if provided
        if (isset($data['progress'])) {
            foreach ($data['progress'] as $course_id => $progress) {
                // UPSERT pattern
                $stmt = $pdo->prepare("INSERT INTO course_progress (user_id, course_id, progress) VALUES (?, ?, ?) 
                                      ON DUPLICATE KEY UPDATE progress = ?");
                $stmt->execute([$user_id, $course_id, $progress, $progress]);
            }
        }

        $pdo->commit();
        echo json_encode(['success' => true]);
    } catch (PDOException $e) {
        $pdo->rollBack();
        echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    }
}
?>
