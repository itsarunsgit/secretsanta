// saveAssignmentFS and getAssignmentFS are available globally via firebase-utils.js script include
let employees = [];
let currentEmployeeName = '';

document.addEventListener('DOMContentLoaded', async () => {
  employees = await loadEmployees();

  // Note: We no longer show existing assignments from URL params
  // Each time an employee visits, they get a new random assignment

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

    // Always create a new assignment (different employee each time)
    createAssignment(actualEmployeeName);
  });
});

async function createAssignment(employeeName) {
  // Get all other employees (excluding yourself)
  let otherEmployees = employees.filter(emp => 
    normalizeName(emp.name) !== normalizeName(employeeName)
  );

  if (otherEmployees.length === 0) {
    alert('No other employees available for assignment.');
    return;
  }

  // Try to avoid the previous assignment if it exists
  try {
    const previousAssignment = await getAssignmentFS(employeeName);
    if (previousAssignment && otherEmployees.length > 1) {
      // Filter out the previous assignment to get a different employee
      otherEmployees = otherEmployees.filter(emp => 
        normalizeName(emp.name) !== normalizeName(previousAssignment.assignedTo)
      );
      // If filtering left no employees, use all other employees
      if (otherEmployees.length === 0) {
        otherEmployees = employees.filter(emp => 
          normalizeName(emp.name) !== normalizeName(employeeName)
        );
      }
    }
  } catch (error) {
    console.error('Error checking previous assignment:', error);
    // Continue with random selection if check fails
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

