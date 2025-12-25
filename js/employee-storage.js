const ASSIGNMENTS_KEY = 'secret_santa_assignments';
const MESSAGES_KEY = 'secret_santa_messages';

// Load employees from JSON file
async function loadEmployees() {
  try {
    const response = await fetch('employees.json');
    const data = await response.json();
    return data.employees;
  } catch (error) {
    console.error('Error loading employees:', error);
    return [];
  }
}

// Get all assignments
function getAssignments() {
  return JSON.parse(localStorage.getItem(ASSIGNMENTS_KEY)) || {};
}

// Save an assignment (employeeName -> assignedEmployeeName)
function saveAssignment(employeeName, assignedEmployeeName) {
  const assignments = getAssignments();
  assignments[employeeName.toLowerCase()] = {
    assignedTo: assignedEmployeeName,
    timestamp: Date.now()
  };
  localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
}

// Get assignment for an employee
function getAssignment(employeeName) {
  const assignments = getAssignments();
  return assignments[employeeName.toLowerCase()];
}

// Save a message (from sender to receiver)
function saveMessage(senderName, receiverName, message) {
  const messages = getMessages();
  const receiverKey = receiverName.toLowerCase();
  
  if (!messages[receiverKey]) {
    messages[receiverKey] = [];
  }
  
  messages[receiverKey].push({
    from: senderName,
    to: receiverName,
    message: message,
    timestamp: Date.now(),
    revealed: false
  });
  
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

// Get all messages
function getMessages() {
  return JSON.parse(localStorage.getItem(MESSAGES_KEY)) || {};
}

// Get messages for an employee
function getMessagesForEmployee(employeeName) {
  const messages = getMessages();
  return messages[employeeName.toLowerCase()] || [];
}

// Reveal sender name for a message (after 1 hour)
function revealSender(employeeName, messageIndex) {
  const messages = getMessages();
  const employeeKey = employeeName.toLowerCase();
  
  if (messages[employeeKey] && messages[employeeKey][messageIndex]) {
    messages[employeeKey][messageIndex].revealed = true;
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }
}

// Check if 1 hour has passed since message was received
function canRevealSender(message) {
  const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
  return Date.now() - message.timestamp >= oneHour;
}

// Get time remaining until reveal is allowed (in milliseconds)
function getTimeUntilReveal(message) {
  const oneHour = 60 * 60 * 1000;
  const timePassed = Date.now() - message.timestamp;
  return Math.max(0, oneHour - timePassed);
}

