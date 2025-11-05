<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$host = "localhost";
$user = "root";
$pass = "R8t7:8=0O+";
$db   = "u666383048_proyectofull";

$conn = new mysqli($host, $user, $pass, $db);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Error de conexión: " . $conn->connect_error]);
  exit;
}

$method = $_SERVER['REQUEST_METHOD'];
$path = $_SERVER['REQUEST_URI'];

// Extraer ID del endpoint, por ejemplo: /api/productos/5
$id = null;
if (preg_match('/\/api\/producto\/(\d+)/', $path, $matches)) {
  $id = intval($matches[1]);
}

switch ($method) {
  case 'GET':
    if ($id) {
      $stmt = $conn->prepare("SELECT * FROM producto WHERE id = ?");
      $stmt->bind_param("i", $id);
      $stmt->execute();
      $result = $stmt->get_result();
      echo json_encode($result->fetch_assoc());
    } else {
      $result = $conn->query("SELECT * FROM producto ORDER BY id DESC");
      $rows = [];
      while ($r = $result->fetch_assoc()) $rows[] = $r;
      echo json_encode($rows);
    }
    break;

  case 'POST':
    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) { echo json_encode(["error" => "Datos inválidos"]); exit; }

    $nombre = $data['nombre'] ?? '';
    $precio = $data['precio_venta'] ?? 0;
    $stock  = $data['stock'] ?? 0;

    $stmt = $conn->prepare("INSERT INTO producto (nombre, precio_venta, stock) VALUES (?, ?, ?)");
    $stmt->bind_param("sdi", $nombre, $precio, $stock);
    $ok = $stmt->execute();

    echo json_encode(["success" => $ok, "id" => $conn->insert_id]);
    break;

  case 'PUT':
    if (!$id) { http_response_code(400); echo json_encode(["error" => "Falta ID"]); exit; }

    $data = json_decode(file_get_contents("php://input"), true);
    if (!$data) { echo json_encode(["error" => "Datos inválidos"]); exit; }

    $nombre = $data['nombre'] ?? '';
    $precio = $data['precio_venta'] ?? 0;
    $stock  = $data['stock'] ?? 0;

    $stmt = $conn->prepare("UPDATE producto SET nombre=?, precio_venta=?, stock=? WHERE id=?");
    $stmt->bind_param("sdii", $nombre, $precio, $stock, $id);
    $ok = $stmt->execute();

    echo json_encode(["success" => $ok]);
    break;

  case 'DELETE':
    if (!$id) { http_response_code(400); echo json_encode(["error" => "Falta ID"]); exit; }

    $stmt = $conn->prepare("DELETE FROM producto WHERE id=?");
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
