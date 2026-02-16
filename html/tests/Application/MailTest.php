<?php
use PHPUnit\Framework\TestCase;
use Application\Mail;

class MailTest extends TestCase {
    protected PDO $pdo;

    protected function setUp(): void
    {
        $dsn = "pgsql:host=" . getenv('DB_TEST_HOST') . ";dbname=" . getenv('DB_TEST_NAME');
        $this->pdo = new PDO($dsn, getenv('DB_USER'), getenv('DB_PASS'));
        $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Clean and reinitialize the table
        $this->pdo->exec("DROP TABLE IF EXISTS mail;");
        $this->pdo->exec("
            CREATE TABLE mail (
                id SERIAL PRIMARY KEY,
                subject TEXT NOT NULL,
                body TEXT NOT NULL
            );
        ");
    }

    public function testCreateMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Alice", "Hello world");
        $this->assertIsInt($id);
        $this->assertEquals(1, $id);
    }

    // Retreive all mail.
    public function testGetAllMail() {
        $mail = new Mail($this->pdo);
        $mail->createMail("Subject 1", "Body 1");
        $mail->createMail("Subject 2", "Body 2");
        $all = $mail->getAll();
        $this->assertCount(2, $all);
        $this->assertEquals("Subject 1", $all[0]['subject']);
        $this->assertEquals("Body 2", $all[1]['body']);
    }

    // Retreive mail by its ID.
    public function testGetMailById() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Hello", "This is a test");
        $item = $mail->getById($id);
        $this->assertIsArray($item);
        $this->assertEquals($id, $item['id']);
        $this->assertEquals("Hello", $item['subject']);
        $this->assertEquals("This is a test", $item['body']);
    }

    // Delete mail.
    public function testDeleteMail() {
        $mail = new Mail($this->pdo);
        $id = $mail->createMail("Temp", "To be deleted");
        $mail->delete($id);
        $item = $mail->getById($id);
        $this->assertFalse($item);
    }
}