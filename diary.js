// src/diary.js
import { db } from './firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

// 保存
export async function saveDiary(date, content) {
  await setDoc(doc(db, "diary", date), {
    text: content,
    updated: serverTimestamp()
  });
}

// 読み込み
export async function loadDiary(date) {
  const docRef = doc(db, "diary", date);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data().text : "";
}
