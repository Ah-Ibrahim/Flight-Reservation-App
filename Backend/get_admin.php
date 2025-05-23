<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: POST, OPTIONS');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond to preflight request with 200 OK and proper headers
    http_response_code(200);
    exit(0);
}

// ... Your existing code below ...

$host = 'localhost';
$dbname = 'flight_booking_system';  // or your DB name
$dbusername = 'root';
$dbpassword = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $dbusername, $dbpassword);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $input = json_decode(file_get_contents("php://input"), true);

    $username = isset($input['username']) ? trim($input['username']) : '';
    $password = isset($input['password']) ? $input['password'] : '';

    if (empty($username) || empty($password)) {
        http_response_code(400);
        echo json_encode(['message' => 'Username and password are required']);
        exit;
    }

    // Fetch admin by Username
    $stmt = $pdo->prepare("SELECT AdminID, Username, Email, PasswordHash, FullName FROM admin WHERE Username = :username");
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->execute();

    $admin = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($admin && password_verify($password, $admin['PasswordHash'])) {
        // Remove password hash before sending
        unset($admin['PasswordHash']);

        echo json_encode(['message' => 'Login successful', 'admin' => $admin]);
    } else {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid username or password']);
    }
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Database error: ' . $e->getMessage()]);
}
?>