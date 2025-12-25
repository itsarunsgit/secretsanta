// Firestore utility functions for assignment and message handling (browser-friendly, no imports)
// Assumes firebase and firestore scripts loaded in HTML
// Assumes window.db2 is globally set up by src/firebase.js (see below for update)

// Save assignment: { name, assignedTo }
window.saveAssignmentFS = async function(name, assignedTo) {
  await window.db2.collection('assignments').doc(name.toLowerCase()).set({
    name,
    assignedTo
  });
};

// Get assignment by name
window.getAssignmentFS = async function(name) {
  const ref = window.db2.collection('assignments').doc(name.toLowerCase());
  const snap = await ref.get();
  return snap.exists ? snap.data() : null;
};

// Save a message: { from, to, message, timestamp, revealed }
window.saveMessageFS = async function(from, to, message) {
  return await window.db2.collection('messages').add({
    from,
    to,
    message,
    timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    revealed: false
  });
};

// Get messages for a recipient (to: employeeName)
window.getMessagesForEmployeeFS = async function(employeeName) {
  const q = await window.db2.collection('messages').where('to', '==', employeeName).get();
  return q.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
