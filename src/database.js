// Converted for browser use (no imports/exports)
// Ensure Firebase and Firestore have been loaded in HTML
// Assumes window.db2 (or window.db) is set in src/firebase.js

window.addUser = async function(name, email) {
  await window.db2.collection("users").add({
    name,
    email,
    createdAt: new Date()
  });
};

window.getUsers = async function() {
  const snapshot = await window.db2.collection("users").get();
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};
