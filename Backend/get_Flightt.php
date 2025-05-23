<?php
// Allow CORS from any origin (adjust * if you want to restrict)
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle OPTIONS request for CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database connection parameters
$host = 'localhost';
$dbname = 'flight_booking_system';   // change this to your DB name
$username = 'root';            // change if needed
$password = '';                // change if needed

try {
    // Connect to database using PDO
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);

    // Set error mode to exceptions
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Query all flights
    $stmt = $pdo->query("SELECT * FROM flight");

    // Fetch all rows as associative array
    $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Output JSON response
    echo json_encode($flights);
} catch (PDOException $e) {
    // If error, return HTTP 500 with error message
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
