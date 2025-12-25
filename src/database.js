import { db } from './firebase.js';
import {
  collection,
  addDoc,
  getDocs
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

export async function addUser(name, email) {
  await addDoc(collection(db, "users"), {
    name,
    email,
    createdAt: new Date()
  });
}

export async function getUsers() {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}
