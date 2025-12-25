// Firestore utility functions for assignment and message handling
import { db2 } from '../src/firebase.js';
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  serverTimestamp
} from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js';

// Save assignment: { name, assignedTo }
export async function saveAssignmentFS(name, assignedTo) {
  await setDoc(doc(collection(db2, 'assignments'), name.toLowerCase()), {
    name,
    assignedTo
  });
}

// Get assignment by name
export async function getAssignmentFS(name) {
  const ref = doc(collection(db2, 'assignments'), name.toLowerCase());
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Save a message: { from, to, message, timestamp, revealed }
export async function saveMessageFS(from, to, message) {
  return await addDoc(collection(db2, 'messages'), {
    from,
    to,
    message,
    timestamp: serverTimestamp(),
    revealed: false
  });
}

// Get messages for a recipient (to: employeeName)
export async function getMessagesForEmployeeFS(employeeName) {
  const q = query(collection(db2, 'messages'), where('to', '==', employeeName));
  const snap = await getDocs(q);
  return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

