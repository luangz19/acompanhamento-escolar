import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD5VvGM5x06rOJ_q5lbjPmYk0lUo8omotE",
  authDomain: "acompanhamento-escolar-b9e79.firebaseapp.com",
  projectId: "acompanhamento-escolar-b9e79",
  storageBucket: "acompanhamento-escolar-b9e79.firebasestorage.app",
  messagingSenderId: "215512760153",
  appId: "1:215512760153:web:7d64cae3328be90d1b9648"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);