  // Core Firebase SDK
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";

  // Add individual products you need (e.g., Auth, Database)
  import { getAuth } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";
  import { getDatabase } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";

  // Your Firebase config
  const firebaseConfig = {
    apiKey: "AIzaSyCc99lqqzDRvLxOEj9fD_Ur0YBUGmNx21s",
    authDomain: "secret-santa-a2b83.firebaseapp.com",
    projectId: "secret-santa-a2b83",
    storageBucket: "secret-santa-a2b83.firebasestorage.app",
    messagingSenderId: "265263442654",
    appId: "1:265263442654:web:b94da5c47ac08a3d54f04f",
    measurementId: "G-V9FQCJP0LG"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getDatabase(app);
  export const db2 = getFirestore(app);


