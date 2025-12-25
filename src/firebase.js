// Firebase v9+ compatibility for browser (no imports/exports)
// Ensure you include these script tags in your HTML BEFORE your own firebase code:
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js"></script>
// <script src="https://www.gstatic.com/firebasejs/8.10.1/firebase-firestore.js"></script>

// Your Firebase config
var firebaseConfig = {
  apiKey: "AIzaSyCc99lqqzDRvLxOEj9fD_Ur0YBUGmNx21s",
  authDomain: "secret-santa-a2b83.firebaseapp.com",
  projectId: "secret-santa-a2b83",
  storageBucket: "secret-santa-a2b83.firebasestorage.app",
  messagingSenderId: "265263442654",
  appId: "1:265263442654:web:b94da5c47ac08a3d54f04f",
  measurementId: "G-V9FQCJP0LG"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Reference to Firestore
window.db2 = firebase.firestore();
