<?php
require '../../vendor/autoload.php';

use Application\Mail;
use Application\Page;

$dsn = "pgsql:host=" . getenv('DB_PROD_HOST') . ";dbname=" . getenv('DB_PROD_NAME');
try {
    $pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'), [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo "Database connection failed: " . $e->getMessage();
    exit;
}

$mail = new Mail($pdo);
$page = new Page();

$uri = $_SERVER['REQUEST_URI'];            
$parts = explode('/', trim($uri, '/'));   
$id = is_numeric(end($parts)) ? (int)end($parts) : null;


$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

if ($method === 'GET') {
    if ($id) {
        $item = $mail->getById((int)$id);
        if ($item) {
            $page->item($item);
        } else {
            $page->notFound();
        }
    } else {
        $page->list($mail->getAll());
    }
    exit;
}

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['subject'], $data['body'])) {
        $page->badRequest();
        exit;
    }
    $id = $mail->createMail($data['subject'], $data['body']);
    $page->item($mail->getById($id));
    exit;
}

if ($method === 'PUT' && $id) {
    $data = json_decode(file_get_contents('php://input'), true);

    // Make sure the request includes both subject and body
    if (!isset($data['subject'], $data['body'])) {
        $page->badRequest();
        exit;
    }

    $updated = $mail->updateMail($id, $data['subject'], $data['body']);

    if ($updated) {
        $page->item($mail->getById($id));
    } else {
        $page->notFound();
    }
    exit;
}

if ($method === 'DELETE' && $id) {
    $mail->delete((int)$id);
    $page->item(["deleted_id" => (int)$id]);
    exit;
}

$page->badRequest();