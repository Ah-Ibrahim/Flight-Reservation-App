<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

// Allow preflight requests to pass
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode(["success" => false, "message" => "Only POST requests are allowed."]);
    exit();
}

// Connect to the database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "flight_booking_system";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Connection failed: " . $conn->connect_error]);
    exit();
}

// Retrieve and trim POST parameters
$cardholdername = trim($_POST['cardName'] ?? '');
$cardnumber = trim($_POST['cardNum'] ?? '');

// Basic validation
if (empty($cardholdername) || empty($cardnumber)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Missing cardholder name or card number."]);
    exit();
}

// Simple card number format check (13 to 19 digits)
if (!preg_match('/^\d{13,19}$/', $cardnumber)) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => "Invalid card number format."]);
    exit();
}

// For testing/demo purposes
$reservationid = 4;
$amount = 5.00;

$sql = "INSERT INTO payment (ReservationID, Amount, PaymentDate, cardholdername, cardnumber) 
        VALUES (?, ?, NOW(), ?, ?)";

$stmt = $conn->prepare($sql);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Prepare failed: " . $conn->error]);
    exit();
}

$stmt->bind_param("idss", $reservationid, $amount, $cardholdername, $cardnumber);

if ($stmt->execute()) {
    echo json_encode(["success" => true, "message" => "Payment data inserted successfully!"]);
} else {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Execution failed: " . $stmt->error]);
}

$stmt->close();
$conn->close();
