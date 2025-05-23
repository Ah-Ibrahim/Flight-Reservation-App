<?php
$host = 'localhost';
$dbname = 'flight_booking_system';
$username = 'root';
$password = '';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Read JSON input from React
    $input = json_decode(file_get_contents("php://input"), true);
    $email = $input['email'];
    $password = $input['password'];

    if (empty($email) || empty($password)) {
        echo json_encode(['error' => 'Email and password are required.']);
        exit;
    }

    // SQL query
    $query = "SELECT PasswordHash FROM Customer WHERE Email = :email";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['PasswordHash'])) {
        echo json_encode(['success' => 'Valid password!']);
    } else {
        echo json_encode(['error' => 'Invalid email or password']);
    }

} catch (PDOException $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
