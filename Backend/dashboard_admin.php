<?php
session_start();
if (!isset($_SESSION['admin_id'])) {
    header("Location: index.html");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Admin Dashboard</title>
    <style>
        body { font-family: Arial; padding: 20px; background: #fff5e6; }
        h1 { color: #cc6600; }
    </style>
</head>
<body>
    <h1>Welcome, Admin!</h1>
    <p>You are successfully logged in as an admin.</p>
    <a href="logout.php">Logout</a>
</body>
</html>
