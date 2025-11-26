// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Firestore を使う場合

const firebaseConfig = {
  apiKey: "AIzaSyCy78wxhK12NNdhuNaDmZNhbLsY97XcUDA",
  authDomain: "diary-app-f1712.firebaseapp.com",
  projectId: "diary-app-f1712",
  storageBucket: "diary-app-f1712.firebasestorage.app",
  messagingSenderId: "532200895072",
  appId: "1:532200895072:web:062ce5f0a535065dec4905"
};

// Firebase 初期化
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app); // Firestore をエクスポートして他のファイルで使える
