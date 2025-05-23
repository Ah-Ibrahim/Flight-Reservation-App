<?php
session_start();
if (!isset($_SESSION['customer_id'])) {
    header("Location: index.html");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Customer Dashboard</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #f0f8ff; }
        h1 { color: #0073e6; }
    </style>
</head>
<body>
    <h1>Welcome, Customer!</h1>
    <p>You are successfully logged in.</p>
    <a href="logout.php">Logout</a>
</body>
</html>
