let employees = [];

document.addEventListener('DOMContentLoaded', async () => {
  employees = await loadEmployees();
  
  // Pre-fill sender name if available from localStorage
  const currentEmployee = localStorage.getItem('currentEmployee');
  if (currentEmployee) {
    document.getElementById('senderName').value = currentEmployee;
  }

  document.getElementById('sendMessageForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const senderName = document.getElementById('senderName').value.trim();
    const messageText = document.getElementById('messageText').value.trim();

    if (!senderName || !messageText) {
      alert('Please fill in all fields');
      return;
    }

    // Check if sender exists
    const sender = employees.find(emp => 
      normalizeName(emp.name) === normalizeName(senderName)
    );

    if (!sender) {
      alert('Your name not found in employee list. Please check your spelling.');
      return;
    }

    // Get assignment to find receiver from Firebase
    const assignment = await getAssignmentFS(senderName);
    if (!assignment) {
      alert('You need to get your assignment first! Please go to the assignment page.');
      window.location.href = 'assign.html';
      return;
    }

    // Save message to Firebase
    try {
      await saveMessageFS(senderName, assignment.assignedTo, messageText);
      // Show success message
      document.getElementById('messageForm').classList.add('hidden');
      document.getElementById('messageSuccess').classList.remove('hidden');
    } catch (err) {
      alert('Error sending message. Please try again.');
      console.error(err);
    }
  });
});

