const STORAGE_KEY = 'secret_santa_data';

function getData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { groups: [] };
}

function saveData(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addGroup(group) {
  const data = getData();
  data.groups.push(group);
  saveData(data);
}

function updateGroup(updatedGroup) {
  const data = getData();
  const idx = data.groups.findIndex(g => g.id === updatedGroup.id);
  if (idx >= 0) data.groups[idx] = updatedGroup;
  saveData(data);
}

function getGroupByAdminToken(token) {
  return getData().groups.find(g => g.adminToken === token);
}

function getGroupByParticipantToken(token) {
  return getData().groups.find(g => g.participants.some(p => p.token === token));
}
