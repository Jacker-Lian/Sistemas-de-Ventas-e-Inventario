<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

$host = "localhost";
$user = "root";
$pass = "";
$db   = "u666383048_proyectofull";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Error al conectar: " . $conn->connect_error]);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$id = $_GET['id'] ?? null;

switch ($method) {
  case 'GET':
    if ($id) {
      $stmt = $conn->prepare("SELECT * FROM productos WHERE id=?");
      $stmt->bind_param("i", $id);
      $stmt->execute();
      $result = $stmt->get_result();
      echo json_encode($result->fetch_assoc());
    } else {
      $result = $conn->query("SELECT * FROM productos ORDER BY id DESC");
      $rows = [];
      while ($r = $result->fetch_assoc()) $rows[] = $r;
      echo json_encode($rows);
    }
    break;

  case 'POST':
    $data = json_decode(file_get_contents("php://input"), true);
    $nombre = $data['nombre'] ?? '';
    $precio = $data['precio'] ?? 0;
    $stock  = $data['stock'] ?? 0;
    $stmt = $conn->prepare("INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)");
    $stmt->bind_param("sdi", $nombre, $precio, $stock);
    $ok = $stmt->execute();
    echo json_encode(["success" => $ok, "id" => $conn->insert_id]);
    break;

  case 'PUT':
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'] ?? null;
    if (!$id) { http_response_code(400); echo json_encode(["error"=>"Falta ID"]); break; }
    $nombre = $data['nombre'] ?? '';
    $precio = $data['precio'] ?? 0;
    $stock  = $data['stock'] ?? 0;
    $stmt = $conn->prepare("UPDATE productos SET nombre=?, precio=?, stock=? WHERE id=?");
    $stmt->bind_param("sdii", $nombre, $precio, $stock, $id);
    $ok = $stmt->execute();
    echo json_encode(["success" => $ok]);
    break;

  case 'DELETE':
    if (!$id) { http_response_code(400); echo json_encode(["error"=>"Falta ID"]); break; }
    $stmt = $conn->prepare("DELETE FROM productos WHERE id=?");
    $stmt->bind_param("i", $id);
    $ok = $stmt->execute();
    echo json_encode(["success" => $ok]);
    break;

  case 'OPTIONS':
    http_response_code(204);
    break;

  default:
    http_response_code(405);
    echo json_encode(["error" => "Método no permitido"]);
    break;
}

$conn->close();
?>
