<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$dbname = 'mp_sales';
$username = 'root';
$password = '';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Create database if not exists
    $pdo->exec("CREATE DATABASE IF NOT EXISTS $dbname");
    $pdo->exec("USE $dbname");
    
    // Create table if not exists
    $pdo->exec("CREATE TABLE IF NOT EXISTS sales (
        id INT AUTO_INCREMENT PRIMARY KEY,
        agent VARCHAR(50) NOT NULL,
        date DATE NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )");

} catch(PDOException $e) {
    die(json_encode([
        'status' => 'error',
        'message' => 'Connection failed: ' . $e->getMessage(),
        'error_details' => $e->getTrace()
    ]));
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    try {
        $query = 'SELECT * FROM sales';
        $params = [];
        
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
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'error_details' => $e->getTrace()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = file_get_contents('php://input');
        $data = json_decode($input, true);
        
        if (!$data) {
            throw new Exception('Invalid JSON data received: ' . $input);
        }

        if (!isset($data['agent']) || !isset($data['date']) || !isset($data['amount']) || !isset($data['status'])) {
            throw new Exception('Missing required fields. Required: agent, date, amount, status');
        }

        if (isset($data['id'])) {
            $stmt = $pdo->prepare('UPDATE sales SET agent = ?, date = ?, amount = ?, status = ? WHERE id = ?');
            $result = $stmt->execute([
                $data['agent'],
                $data['date'],
                $data['amount'],
                $data['status'],
                $data['id']
            ]);
        } else {
            $stmt = $pdo->prepare('INSERT INTO sales (agent, date, amount, status) VALUES (?, ?, ?, ?)');
            $result = $stmt->execute([
                $data['agent'],
                $data['date'],
                $data['amount'],
                $data['status']
            ]);
        }

        if ($result) {
            echo json_encode(['status' => 'success']);
        } else {
            throw new Exception('Database operation failed');
        }
    } catch(Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'error_details' => $e->getTrace()
        ]);
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    try {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id'])) {
            throw new Exception('Missing ID for delete operation');
        }

        $stmt = $pdo->prepare('DELETE FROM sales WHERE id = ?');
        $result = $stmt->execute([$data['id']]);

        if ($result) {
            echo json_encode(['status' => 'success']);
        } else {
            throw new Exception('Delete operation failed');
        }
    } catch(Exception $e) {
        echo json_encode([
            'status' => 'error',
            'message' => $e->getMessage(),
            'error_details' => $e->getTrace()
        ]);
    }
}
