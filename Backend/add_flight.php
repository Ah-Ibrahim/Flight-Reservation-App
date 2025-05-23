<?php
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

// Handle CORS preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    // Collect and trim all inputs except FlightID
    $FlightNumber = trim($data['FlightNumber'] ?? '');
    $Airline = trim($data['Airline'] ?? '');
    $DepartureCity = trim($data['DepartureCity'] ?? '');
    $ArrivalCity = trim($data['ArrivalCity'] ?? '');
    $DepartureTime = trim($data['DepartureTime'] ?? '');
    $ArrivalTime = trim($data['ArrivalTime'] ?? '');
    $Gate = trim($data['Gate'] ?? '');
    $Status = trim($data['Status'] ?? '');
    $Capacity = trim($data['Capacity'] ?? '');

    // Basic validation
    if (!$FlightNumber || !$Airline || !$DepartureCity || !$ArrivalCity 
        || !$DepartureTime || !$ArrivalTime || !$Gate || !$Status || !$Capacity) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    // Validate date format (basic)
    if (!strtotime($DepartureTime) || !strtotime($ArrivalTime)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid date/time format.']);
        exit;
    }

    // Validate Capacity is a positive integer
    if (!ctype_digit($Capacity) || (int)$Capacity <= 0) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Capacity must be a positive integer.']);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insert query without FlightID
        $sql = "INSERT INTO flight 
            (FlightNumber, Airline, DepartureCity, ArrivalCity, DepartureTime, ArrivalTime, Gate, Status, Capacity)
            VALUES (:FlightNumber, :Airline, :DepartureCity, :ArrivalCity, :DepartureTime, :ArrivalTime, :Gate, :Status, :Capacity)";

        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':FlightNumber' => $FlightNumber,
            ':Airline' => $Airline,
            ':DepartureCity' => $DepartureCity,
            ':ArrivalCity' => $ArrivalCity,
            ':DepartureTime' => $DepartureTime,
            ':ArrivalTime' => $ArrivalTime,
            ':Gate' => $Gate,
            ':Status' => $Status,
            ':Capacity' => $Capacity
        ]);

        // Optionally return the new FlightID
        $newFlightID = $pdo->lastInsertId();

        http_response_code(201);
        echo json_encode(['success' => true, 'message' => 'Flight added successfully.', 'FlightID' => $newFlightID]);

    } catch (PDOException $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed. Use POST.']);
}
?>
