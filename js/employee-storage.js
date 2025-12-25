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
async function saveMessage(senderName, receiverName, message) {
  try {
    const response = await fetch('save_message.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderName,
        receiverName,
        message
      })
    });
    const result = await response.json();
    if (!result.success) {
      console.error('Failed to save message');
    }
  } catch (error) {
    console.error('Error saving message:', error);
  }
}

// Get all messages
async function getMessages() {
  try {
    const response = await fetch('messages.json');
    return await response.json();
  } catch (error) {
    console.error('Error loading messages:', error);
    return {};
  }
}

// Get messages for an employee
async function getMessagesForEmployee(employeeName) {
  const messages = await getMessages();
  return messages[employeeName.toLowerCase()] || [];
}

// Reveal sender name for a message (after 1 hour)
async function revealSender(employeeName, messageIndex) {
  try {
    const response = await fetch('save_message.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'reveal',
        employeeName,
        messageIndex
      })
    });
    const result = await response.json();
    if (!result.success) {
      console.error('Failed to reveal sender');
    }
  } catch (error) {
    console.error('Error revealing sender:', error);
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

