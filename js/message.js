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

    // Use the actual employee name from the list for consistency
    const actualEmployeeName = sender.name;

    // Ensure Firebase is initialized
    if (!window.db2) {
      alert('Firebase is not initialized. Please refresh the page and try again.');
      console.error('Firebase db2 is not available');
      return;
    }

    // Get assignment to find receiver from Firebase
    // Try with actual employee name first, then fallback to user input (for backward compatibility)
    let assignment;
    try {
      console.log('Looking for assignment for:', actualEmployeeName);
      assignment = await getAssignmentFS(actualEmployeeName);
      console.log('Assignment result with actual name:', assignment);
      
      // If not found with actual name, try with user input (for old assignments)
      if (!assignment && normalizeName(actualEmployeeName) !== normalizeName(senderName)) {
        console.log('Trying with user input name:', senderName);
        assignment = await getAssignmentFS(senderName);
        console.log('Assignment result with user input:', assignment);
      }
    } catch (error) {
      console.error('Error fetching assignment:', error);
      alert('Error checking assignment. Please try again.');
      return;
    }

    if (!assignment) {
      console.log('No assignment found for:', actualEmployeeName, 'or', senderName);
      alert('You need to get your assignment first! Please go to the assignment page.');
      window.location.href = 'assign.html';
      return;
    }

    // Save message to Firebase
    try {
      await saveMessageFS(actualEmployeeName, assignment.assignedTo, messageText);
      // Show success message
      document.getElementById('messageForm').classList.add('hidden');
      document.getElementById('messageSuccess').classList.remove('hidden');
    } catch (err) {
      alert('Error sending message. Please try again.');
      console.error(err);
    }
  });
});

