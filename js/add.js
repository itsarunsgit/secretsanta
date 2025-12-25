const adminToken = getQueryParam('admin');
const group = getGroupByAdminToken(adminToken);
const listEl = document.getElementById('participantList');
const infoEl = document.getElementById('groupInfo');

if (!group) {
  document.body.innerHTML = '<p class="text-center text-red-600">Invalid or expired admin token.</p>';
} else {
  infoEl.innerHTML = `<strong>${group.name}</strong> | Budget: ${group.budget || 'N/A'} | Date: ${group.eventDate}`;
  renderList();

  document.getElementById('addParticipantForm').addEventListener('submit', e => {
    e.preventDefault();
    if (group.locked) return alert('Group is locked.');
    const name = document.getElementById('participantName').value.trim();
    const email = document.getElementById('participantEmail').value.trim();
    const participant = { id: generateId(), name, email, token: generateId(), receiverId: null };
    group.participants.push(participant);
    updateGroup(group);
    renderList();
    e.target.reset();
  });

  document.getElementById('generateSantaBtn').addEventListener('click', () => {
    if (group.locked) return alert('Already generated!');
    if (group.participants.length < 2) return alert('At least 2 participants required.');
    generateSecretSanta(group);
    group.locked = true;
    updateGroup(group);
    renderList();
    alert('Secret Santa generated! Share each participant’s unique link with them.');
  });
}

function renderList() {
  listEl.innerHTML = group.participants.map(p =>
    `<li class="border p-2 rounded">
      ${p.name} (${p.email}) 
      <br><small class="text-gray-500">Reveal link: reveal.html?token=${p.token}</small>
    </li>`).join('');
}
