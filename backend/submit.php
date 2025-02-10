<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $email = $_POST['email'];
    $message = $_POST['message'];

    // Here you can store data in database
    // And return success/failure response

    echo json_encode(["status" => "success", "message" => "Application submitted successfully!"]);
} else {
    echo json_encode(["status" => "error", "message" => "Invalid request."]);
}
?>
