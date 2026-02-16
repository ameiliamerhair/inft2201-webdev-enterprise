<?php
namespace Application;

use PDO;

class Mail {
    protected PDO $pdo;

    public function __construct(PDO $pdo)
    {
        $this->pdo = $pdo;
    }

    public function createMail($subject, $body) {
        $stmt = $this->pdo->prepare("INSERT INTO mail (subject, body) VALUES (?, ?) RETURNING id");
        $stmt->execute([$subject, $body]);

        return $stmt->fetchColumn();
    }

    public function getAll() {
        $stmt = $this->pdo->query("SELECT id, subject, body FROM mail ORDER BY id");
        
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getById(int $id) {
        $stmt = $this->pdo->prepare("SELECT id, subject, body FROM mail WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: false; 
    }

    public function delete(int $id) {
        $stmt = $this->pdo->prepare("DELETE FROM mail WHERE id = ?");
        $stmt->execute([$id]);
    }
}