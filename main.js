/* ============================================================
   main.js
   ・現在日時の取得
   ・LocalStorage の読み書き
   ・共通処理
============================================================ */
// 現在日時の取得
const now = new Date();

// 今日の日付を文字列キーで保持
window.TODAY = {
    year: now.getFullYear(),
    month: now.getMonth() + 1,
    day: now.getDate(),
    iso: `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}`
};

// LocalStorage読み書き関数もここに置く
function loadDiary() {
    return JSON.parse(localStorage.getItem("diary") || "{}");
}

function saveDiary(data) {
    localStorage.setItem("diary", JSON.stringify(data));
}

/* ============================================================
   共通ヘッダー読み込み
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("headerContainer");
    if (headerContainer) {
        fetch("header.html")
            .then(res => res.text())
            .then(html => headerContainer.innerHTML = html);
    }
});


/* ============================================================
   detail.html（詳細画面だけ担当）
   ============================================================ */
if (location.pathname.includes("detail.html")) {
    const params = new URLSearchParams(location.search);
    let dateKey = params.get("date");
    let dateObj = new Date(dateKey);
    const weekdays = ["日","月","火","水","木","金","土"];

    const dateCenterEl = document.getElementById("dateCenter");
    const memoEl = document.getElementById("memoText");

    // 日付更新
    function updateDetail() {
        dateCenterEl.textContent =
            `${dateObj.getFullYear()}年${dateObj.getMonth()+1}月${dateObj.getDate()}日（${weekdays[dateObj.getDay()]}）`;

        const diary = loadDiary();
        memoEl.value = diary[dateKey] || "";
    }

    updateDetail();

    // 保存
    window.saveMemo = () => {
        const diary = loadDiary();
        diary[dateKey] = memoEl.value;
        saveDiary(diary);
        alert("保存しました");
    };

    // 戻る
    window.goBack = () => location.href = "index.html";

    // 前日
    window.prevDay = () => {
        dateObj.setDate(dateObj.getDate() - 1);
        dateKey = dateObj.toISOString().split("T")[0];
        updateDetail();
    };

    // 翌日
    window.nextDay = () => {
        dateObj.setDate(dateObj.getDate() + 1);
        dateKey = dateObj.toISOString().split("T")[0];
        updateDetail();
    };
}
