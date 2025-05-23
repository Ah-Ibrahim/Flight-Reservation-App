<?php
session_start();

// Destroy the session to log the user out
session_unset(); // Unset all session variables
session_destroy(); // Destroy the session

// Redirect the user to the login page
header("Location: index.html");
exit;
?>
