document.getElementById('createGroupForm').addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('groupName').value.trim();
  const budget = document.getElementById('budget').value.trim();
  const eventDate = document.getElementById('eventDate').value;

  const group = {
    id: generateId(),
    name,
    budget,
    eventDate,
    locked: false,
    adminToken: generateId(),
    participants: []
  };

  addGroup(group);
  window.location.href = `add.html?admin=${group.adminToken}`;
});
