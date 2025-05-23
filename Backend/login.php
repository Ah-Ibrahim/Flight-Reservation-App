<?php
// Include the PDO connection setup
include 'db.php';  // Adjust the path to your database connection file

// Start output buffering to handle redirects properly
ob_start();

// Check if the form is submitted
if ($_SERVER["REQUEST_METHOD"] == "POST") {

    // Get form data (email and password)
    $email = $_POST['email'];  // Email entered by the user
    $password = $_POST['password'];  // Password entered by the user

    // Validate form inputs
    if (empty($email) || empty($password)) {
        echo json_encode(array('error' => 'Please enter both email and password.'));
        exit;
    }

    try {
        // Prepare SQL query to get the hashed password from the database
        $query = "SELECT PasswordHash FROM Customer WHERE Email = :email";
        $stmt = $pdo->prepare($query);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();

        // Fetch the result
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // Check if the password matches the hashed password stored in the database
            if (password_verify($password, $result['PasswordHash'])) {
                // Login successful
                session_start();
                $_SESSION['email'] = $email; // Store user email in session
                echo json_encode(array('success' => 'valid password!')); // Send success response
                exit;
            } else {
                echo json_encode(array('error' => 'Invalid password!')); // Send error response for invalid password
            }
        } else {
            echo json_encode(array('error' => 'No user found with this email.')); // Send error response for invalid email
        }
    } catch (PDOException $e) {
        // Handle any database errors
        echo json_encode(array('error' => 'Error: ' . $e->getMessage())); // Send error message
    }
}

// End the output buffering and flush the buffer
ob_end_flush();
?>
