// saveAssignmentFS and getAssignmentFS are available globally via firebase-utils.js script include
let employees = [];
let currentEmployeeName = '';

document.addEventListener('DOMContentLoaded', async () => {
  employees = await loadEmployees();

  // Check if already assigned in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  if (name) {
    showAssignment(name);
  }

  document.getElementById('nameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('employeeName');
    const employeeName = nameInput.value.trim();

    if (!employeeName) {
      alert('Please enter your name');
      return;
    }

    // Check if employee exists
    const employee = employees.find(emp => 
      normalizeName(emp.name) === normalizeName(employeeName)
    );
    if (!employee) {
      alert('Name not found in employee list. Please check your spelling.');
      return;
    }

    // Use the actual employee name from the list for consistency
    const actualEmployeeName = employee.name;

    // Check if already assigned
    let existingAssignment;
    try {
      existingAssignment = await getAssignmentFS(actualEmployeeName);
    } catch (error) {
      console.error('Error fetching assignment:', error);
      alert('Error checking assignment. Please try again.');
      return;
    }

    if (existingAssignment) {
      showAssignment(actualEmployeeName, existingAssignment);
    } else {
      // Create new assignment
      createAssignment(actualEmployeeName);
    }
  });
});

async function createAssignment(employeeName) {
  // Get all other employees (excluding yourself)
  const otherEmployees = employees.filter(emp => 
    normalizeName(emp.name) !== normalizeName(employeeName)
  );

  if (otherEmployees.length === 0) {
    alert('No other employees available for assignment.');
    return;
  }

  // Randomly select one from other employees
  const shuffled = shuffleArray(otherEmployees);
  const assignedEmployee = shuffled[0];

  // Save assignment in Firestore
  try {
    await saveAssignmentFS(employeeName, assignedEmployee.name);
  } catch (error) {
    console.error('Error saving assignment:', error);
    alert('Error saving assignment. Please try again.');
    return;
  }

  // Store current employee name
  localStorage.setItem('currentEmployee', employeeName);

  showAssignment(employeeName, { name: employeeName, assignedTo: assignedEmployee.name });
}

function showAssignment(employeeName, assignment) {
  if (!assignment) {
    alert('No assignment found. Please create one first.');
    return;
  }

  document.getElementById('assignmentForm').classList.add('hidden');
  document.getElementById('assignmentResult').classList.remove('hidden');
  document.getElementById('assignedPerson').textContent = assignment.assignedTo;

  // Store current employee name for message page
  localStorage.setItem('currentEmployee', employeeName);
}

