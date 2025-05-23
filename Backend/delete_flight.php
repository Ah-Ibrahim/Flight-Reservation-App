<?php
// Enable error reporting (debugging only)
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// DB config
$host = 'localhost';
$dbname = 'flight_booking_system';
$username = 'root';
$password = '';

// CORS headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Content-Type: application/json');

// Handle CORS preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Only allow POST method
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Read and decode JSON input
    $rawBody = file_get_contents("php://input");
    error_log("Raw input: " . $rawBody);

    $data = json_decode($rawBody, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid JSON input']);
        exit;
    }

    $FlightID = trim($data['FlightID'] ?? '');
    error_log("Received FlightID: " . $FlightID);

    if (!$FlightID) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'FlightID is required.']);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Start transaction
        $pdo->beginTransaction();

        // Delete related reservations first
        $stmt = $pdo->prepare("DELETE FROM reservation WHERE FlightID = :FlightID");
        $stmt->execute([':FlightID' => $FlightID]);

        // Delete related flightprice entries
        $stmt = $pdo->prepare("DELETE FROM flightprice WHERE FlightID = :FlightID");
        $stmt->execute([':FlightID' => $FlightID]);

        // Now delete the flight
        $stmt = $pdo->prepare("DELETE FROM flight WHERE FlightID = :FlightID");
        $stmt->execute([':FlightID' => $FlightID]);

        if ($stmt->rowCount() > 0) {
            // Commit transaction only if flight deleted
            $pdo->commit();

            // Reset AUTO_INCREMENT to max(FlightID) + 1 after deletion
            $stmtMax = $pdo->query("SELECT MAX(FlightID) AS maxID FROM flight");
            $maxID = $stmtMax->fetch(PDO::FETCH_ASSOC)['maxID'] ?? 0;
            $newAI = $maxID + 1;
            $pdo->exec("ALTER TABLE flight AUTO_INCREMENT = $newAI");

            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Flight and related data deleted successfully.']);
        } else {
            // Rollback if flight not found/deleted
            $pdo->rollBack();

            http_response_code(404);
            echo json_encode(['success' => false, 'message' => 'Flight not found.']);
        }
    } catch (PDOException $e) {
        // Rollback on error
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
}
