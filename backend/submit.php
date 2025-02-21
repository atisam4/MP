<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

$host = 'localhost';
$dbname = 'mp_sales';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die(json_encode(['status' => 'error', 'message' => 'Connection failed: ' . $e->getMessage()]));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = 'SELECT * FROM sales';
        $params = [];
        
        // Check if we have filter parameters
        if (isset($_GET['agent']) && isset($_GET['start_date']) && isset($_GET['end_date'])) {
            $query = 'SELECT * FROM sales WHERE agent = ? AND date BETWEEN ? AND ? ORDER BY date DESC';
            $params = [$_GET['agent'], $_GET['start_date'], $_GET['end_date']];
        } else {
            $query .= ' ORDER BY date DESC';
        }
        
        $stmt = $pdo->prepare($query);
        $stmt->execute($params);
        $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode(['status' => 'success', 'data' => $data]);
    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        if (isset($data['id'])) {
            // Update existing record
            $stmt = $pdo->prepare('UPDATE sales SET agent = ?, date = ?, amount = ?, status = ? WHERE id = ?');
            $stmt->execute([$data['agent'], $data['date'], $data['amount'], $data['status'], $data['id']]);
        } else {
            // Insert new record
            $stmt = $pdo->prepare('INSERT INTO sales (agent, date, amount, status) VALUES (?, ?, ?, ?)');
            $stmt->execute([$data['agent'], $data['date'], $data['amount'], $data['status']]);
        }
        echo json_encode(['status' => 'success']);
    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $data = json_decode(file_get_contents('php://input'), true);
    
    try {
        $stmt = $pdo->prepare('DELETE FROM sales WHERE id = ?');
        $stmt->execute([$data['id']]);
        echo json_encode(['status' => 'success']);
    } catch(PDOException $e) {
        echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    }
}
