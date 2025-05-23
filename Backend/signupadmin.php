<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    $username = trim($data['username'] ?? '');
    $email = trim($data['email'] ?? '');
    $password = $data['password'] ?? '';
    $fullname = trim($data['fullname'] ?? '');

    if (empty($username) || empty($email) || empty($password) || empty($fullname)) {
        echo json_encode(['error' => 'Please fill all required fields.']);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=localhost;dbname=flight_booking_system", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check if username or email already exists
        $stmt = $pdo->prepare("SELECT 1 FROM admin WHERE Username = :username OR Email = :email");
        $stmt->execute([':username' => $username, ':email' => $email]);
        if ($stmt->fetch()) {
            echo json_encode(['error' => 'Username or Email already exists']);
            exit;
        }

        // Hash password securely
        $passwordHash = password_hash($password, PASSWORD_DEFAULT);

        // Insert new admin user (AdminID auto-increments)
        $stmt = $pdo->prepare("INSERT INTO admin (Username, Email, PasswordHash, FullName) VALUES (:username, :email, :passwordHash, :fullname)");
        $stmt->execute([
            ':username' => $username,
            ':email' => $email,
            ':passwordHash' => $passwordHash,
            ':fullname' => $fullname
        ]);

        echo json_encode(['success' => 'Admin registered successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Invalid request method']);
}
