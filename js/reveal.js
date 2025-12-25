const token = getQueryParam('token');
const group = getGroupByParticipantToken(token);
const content = document.getElementById('revealContent');

if (!group) {
  content.innerHTML = '<p class="text-red-600">Invalid or expired link.</p>';
} else {
  const participant = group.participants.find(p => p.token === token);
  if (!participant.receiverId) {
    content.innerHTML = '<p>Assignments not yet generated!</p>';
  } else {
    const receiver = group.participants.find(p => p.id === participant.receiverId);
    content.innerHTML = `
      <p>Hi <strong>${participant.name}</strong>! 🎅</p>
      <p>Your Secret Santa gift should go to:</p>
      <h2 class="text-2xl font-bold text-green-700 mt-3">${receiver.name}</h2>
      <p class="mt-2 text-gray-600">Event: ${group.eventDate} | Budget: ${group.budget || 'N/A'}</p>
    `;
  }
}
