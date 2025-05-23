<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require 'db.php';

try {
    $data = json_decode(file_get_contents('php://input'), true);

    // Check required fields — case sensitive keys from React frontend
    if (!isset($data['username'], $data['password'])) {
        http_response_code(400);
        echo json_encode(['message' => 'Missing required fields']);
        exit;
    }

    $username = trim($data['username']);
    $password = $data['password'];

    // Fetch user from database
    $stmt = $pdo->prepare("SELECT * FROM admin WHERE Username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    // Verify user exists and password matches
    if (!$user || !password_verify($password, $user['PasswordHash'])) {
        http_response_code(401);
        echo json_encode(['message' => 'Invalid credentials']);
        exit;
    }

    // Remove password hash before sending user info back
    unset($user['PasswordHash']);

    echo json_encode(['message' => 'Login successful', 'admin' => $user]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['message' => 'Server error', 'error' => $e->getMessage()]);
}
