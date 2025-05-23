<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents("php://input"), true);

    // Extract fields
    $ssn = $data['ssn'] ?? '';
    $firstname = $data['firstname'] ?? '';
    $lastname = $data['lastname'] ?? '';
    $dob = $data['dob'] ?? '';
    $email = $data['email'] ?? '';
    $address = $data['address'] ?? 'N/A';
    $phonenumber = $data['phonenumber'] ?? '';
    $password = $data['password'] ?? '';
    $confirm_password = $data['confirm_password'] ?? '';

    // Validate required fields
    if (empty($ssn) || empty($firstname) || empty($lastname) || empty($dob) || empty($email) || empty($password)) {
        echo json_encode(['error' => 'Please fill all required fields.']);
        exit;
    }

    if ($password !== $confirm_password) {
        echo json_encode(['error' => 'Passwords do not match!']);
        exit;
    }

    $passwordHash = password_hash($password, PASSWORD_DEFAULT);

    try {
        $pdo = new PDO("mysql:host=localhost;dbname=flight_booking_system", "root", "");
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $sql = "INSERT INTO Customer (SSN, FirstName, LastName, DateOfBirth, Email, Address, PasswordHash, PhoneNumber)
                VALUES (:ssn, :firstname, :lastname, :dob, :email, :address, :passwordHash, :phonenumber)";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':ssn', $ssn);
        $stmt->bindParam(':firstname', $firstname);
        $stmt->bindParam(':lastname', $lastname);
        $stmt->bindParam(':dob', $dob);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':address', $address);
        $stmt->bindParam(':passwordHash', $passwordHash);
        $stmt->bindParam(':phonenumber', $phonenumber);

        $stmt->execute();

        echo json_encode(['success' => 'User registered successfully!']);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
    }
}
?>
