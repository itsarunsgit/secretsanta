import { getMessagesForEmployeeFS } from './firebase-utils.js';

let employees = [];
let currentEmployeeName = '';
let messageTimers = [];

document.addEventListener('DOMContentLoaded', async () => {
  employees = await loadEmployees();
  
  // Check if name in URL params
  const urlParams = new URLSearchParams(window.location.search);
  const name = urlParams.get('name');
  if (name) {
    showMessages(name);
  }

  document.getElementById('getNameForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const employeeName = document.getElementById('employeeName').value.trim();
    
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

    showMessages(employeeName);
  });
});

async function showMessages(employeeName) {
  currentEmployeeName = employeeName;
  let messages = [];
  try {
    messages = await getMessagesForEmployeeFS(employeeName);
  } catch (err) {
    alert('Error loading messages from database.');
    console.error(err);
    messages = [];
  }

  // Clear previous timers
  messageTimers.forEach(timer => clearInterval(timer));
  messageTimers = [];

  document.getElementById('nameInputSection').classList.add('hidden');
  document.getElementById('messagesSection').classList.remove('hidden');
  document.getElementById('noMessagesSection').classList.add('hidden');

  if (messages.length === 0) {
    document.getElementById('messagesSection').classList.add('hidden');
    document.getElementById('noMessagesSection').classList.remove('hidden');
    return;
  }

  const messagesList = document.getElementById('messagesList');
  messagesList.innerHTML = '';

  messages.forEach((msg, index) => {
    const messageCard = createMessageCard(msg, index);
    messagesList.appendChild(messageCard);
    
    // Start timer for reveal button if not already revealed and not ready
    if (!msg.revealed && !canRevealSender(msg)) {
      startRevealTimer(index);
    }
  });
}

function createMessageCard(message, index) {
  const card = document.createElement('div');
  card.className = 'bg-gray-50 border-2 border-gray-300 rounded-lg p-4';
  card.id = `message-${index}`;

  const canReveal = canRevealSender(message);
  const timeRemaining = getTimeUntilReveal(message);

  let actionHtml = '';
  if (message.revealed) {
    actionHtml = `<p class="text-sm text-gray-700">From: <span class="font-semibold text-purple-700">${escapeHtml(message.from)}</span></p>`;
  } else if (canReveal) {
    actionHtml = `<button class="reveal-btn bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700" data-index="${index}">Reveal Sender</button>`;
  } else {
    actionHtml = `<span class="text-sm text-gray-600">Reveal available in: <span class="timer-${index} font-semibold">${formatTimeRemaining(timeRemaining)}</span></span>`;
  }

  card.innerHTML = `
    <div class="mb-3">
      <p class="text-gray-800 font-medium">${escapeHtml(message.message)}</p>
    </div>
    <div class="flex items-center justify-between">
      <div>${actionHtml}</div>
    </div>
  `;

  // Add event listener for reveal button
  const revealBtn = card.querySelector('.reveal-btn');
  if (revealBtn) {
    revealBtn.addEventListener('click', () => {
      revealSender(currentEmployeeName, index);
      showMessages(currentEmployeeName); // Refresh to show revealed name
    });
  }

  return card;
}

function startRevealTimer(messageIndex) {
  const timer = setInterval(() => {
    const messages = getMessagesForEmployee(currentEmployeeName);
    const message = messages[messageIndex];
    
    if (!message) {
      clearInterval(timer);
      return;
    }

    const canReveal = canRevealSender(message);
    const timeRemaining = getTimeUntilReveal(message);
    const timerElement = document.querySelector(`.timer-${messageIndex}`);

    if (canReveal && !message.revealed) {
      // Update card to show reveal button
      clearInterval(timer);
      showMessages(currentEmployeeName); // Refresh to show reveal button
    } else if (timerElement) {
      timerElement.textContent = formatTimeRemaining(timeRemaining);
    }
  }, 1000); // Update every second

  messageTimers.push(timer);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

