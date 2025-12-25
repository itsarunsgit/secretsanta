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

    // Check if already assigned
    const existingAssignment = getAssignment(employeeName);
    if (existingAssignment) {
      showAssignment(employeeName);
    } else {
      // Create new assignment
      createAssignment(employeeName);
    }
  });
});

function createAssignment(employeeName) {
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

  // Save assignment
  saveAssignment(employeeName, assignedEmployee.name);
  
  // Store current employee name
  localStorage.setItem('currentEmployee', employeeName);
  
  showAssignment(employeeName);
}

function showAssignment(employeeName) {
  const assignment = getAssignment(employeeName);
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

