<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['ok' => false, 'error' => 'POST required']);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$to = filter_var($input['to'] ?? '', FILTER_SANITIZE_EMAIL);
$subject = htmlspecialchars($input['subject'] ?? '', ENT_QUOTES, 'UTF-8');
$body = $input['body'] ?? '';

if (!$to || !$subject || !$body) {
    echo json_encode(['ok' => false, 'error' => 'Missing required fields']);
    exit;
}

if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['ok' => false, 'error' => 'Invalid email']);
    exit;
}

$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Double Coin Heavy Duty <info@doublecoins-heavyduty.com>\r\n";
$headers .= "Reply-To: info@doublecoins-heavyduty.com\r\n";

$sent = mail($to, $subject, $body, $headers);

if ($sent) {
    echo json_encode(['ok' => true]);
} else {
    echo json_encode(['ok' => false, 'error' => 'Mail sending failed']);
}
