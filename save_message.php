<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$messagesFile = 'messages.json';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    $messages = json_decode(file_get_contents($messagesFile), true) ?: [];
    
    if (isset($input['action']) && $input['action'] === 'reveal') {
        $receiverKey = strtolower($input['employeeName']);
        if (isset($messages[$receiverKey][$input['messageIndex']])) {
            $messages[$receiverKey][$input['messageIndex']]['revealed'] = true;
            file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));
            echo json_encode(['success' => true]);
        } else {
            http_response_code(400);
            echo json_encode(['error' => 'Message not found']);
        }
    } else {
        if (!$input || !isset($input['senderName']) || !isset($input['receiverName']) || !isset($input['message'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Invalid input']);
            exit;
        }
        
        $receiverKey = strtolower($input['receiverName']);
        if (!isset($messages[$receiverKey])) {
            $messages[$receiverKey] = [];
        }
        
        $messages[$receiverKey][] = [
            'from' => $input['senderName'],
            'message' => $input['message'],
            'timestamp' => time() * 1000, // JavaScript timestamp
            'revealed' => false
        ];
        
        file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT));
        
        echo json_encode(['success' => true]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
?>