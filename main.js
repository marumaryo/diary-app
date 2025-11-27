/* ============================================================
   main.js
   ・現在日時の取得
   ・LocalStorage の読み書き
   ・共通処理
============================================================ */
// 現在日時
const now = new Date();
window.TODAY = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    iso: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
};

// Firebase 日記読み込み・保存関数
async function loadDiary() { /* ... */ }
async function saveDiary(dateKey, content) { /* ... */ }

// ------------------------
// 共通ヘッダー読み込み
// ------------------------
document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("headerContainer");
    if (headerContainer) {
        const headerPath = location.pathname.includes("detail.html") ? "../header.html" : "header.html";
        fetch(headerPath)
            .then(res => res.text())
            .then(html => headerContainer.innerHTML = html)
            .catch(err => console.error("ヘッダー読み込みエラー:", err));
    }
});
