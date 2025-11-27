// firebase.js
// Firebase 初期化（非モジュール方式）
const firebaseConfig = {
    apiKey: "AIzaSyCy78wxhK12NNdhuNaDmZNhbLsY97XcUDA",
    authDomain: "diary-app-f1712.firebaseapp.com",
    projectId: "diary-app-f1712"
};

const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
window.db = db; // 他のJSから参照可能
