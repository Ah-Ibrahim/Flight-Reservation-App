<?php

$host = 'localhost';       // Change if different
$dbname = 'flight_booking_system'; // Replace with your database name
$username = 'root';   // Replace with your database username
$password = '';   // Replace with your database password

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents("php://input"), true);
    $from = $_POST['from'];
    $to = $_POST['to'];
    $startDate = $_POST['startDate'];
}


?>
