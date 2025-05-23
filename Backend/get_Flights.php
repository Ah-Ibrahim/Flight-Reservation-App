<?php
// DB config
$host = 'localhost';
$dbname = 'flight_booking_system';
$username = 'root';
$password = '';

// Headers
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// POST only
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);

    $DepartureCity = trim($data['from'] ?? '');
    $ArrivalCity = trim($data['to'] ?? '');
    $departureDate = trim($data['departureDate'] ?? '');
    $arrivalDate = trim($data['arrivalDate'] ?? '');

    // Validate all fields
    if (!$DepartureCity || !$ArrivalCity || !$departureDate || !$arrivalDate) {
        echo json_encode([
            'success' => false,
            'message' => 'Missing or invalid input.'
        ]);
        exit;
    }

    // Validate date format
    if (!strtotime($departureDate) || !strtotime($arrivalDate)) {
        echo json_encode([
            'success' => false,
            'message' => 'Invalid date format.'
        ]);
        exit;
    }

    // Convert to full-day range
    $startDate = date('Y-m-d 00:00:00', strtotime($departureDate));
    $endDate = date('Y-m-d 23:59:59', strtotime($arrivalDate));

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $query = "SELECT 
            FlightID,
            FlightNumber,
            Airline,
            DepartureCity,
            ArrivalCity,
            DepartureTime,
            ArrivalTime,
            Gate,
            Status,
            Capacity
            FROM flight
            WHERE UPPER(DepartureCity) = UPPER(:DepartureCity)
              AND UPPER(ArrivalCity) = UPPER(:ArrivalCity)
              AND DepartureTime BETWEEN :StartDate AND :EndDate";

        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':DepartureCity', $DepartureCity);
        $stmt->bindParam(':ArrivalCity', $ArrivalCity);
        $stmt->bindParam(':StartDate', $startDate);
        $stmt->bindParam(':EndDate', $endDate);
        $stmt->execute();

        $flights = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode([
            'success' => !empty($flights),
            'message' => empty($flights) ? 'No flights found.' : '',
            'flights' => $flights
        ], JSON_PRETTY_PRINT);

    } catch (PDOException $e) {
        echo json_encode([
            'success' => false,
            'error' => 'Database error: ' . $e->getMessage()
        ]);
    }
}
?>
