/* ============================================================
   日記アプリ ロジックファイル
   ・カレンダー生成
   ・LocalStorage保存
   ・詳細画面遷移
   ・共通ヘッダー読み込み
   ============================================================ */

/* ============================================================
   1) LocalStorage の読み書き
   ============================================================ */
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
            .then(html => { headerContainer.innerHTML = html; });
    }
});

/* ============================================================
   2) index.html（カレンダー画面） ---------------------------------
   ============================================================ */
let current = new Date();

// 曜日配列（月曜始まり）
const weekdays = [
    { label: "月", type: "weekday" },
    { label: "火", type: "weekday" },
    { label: "水", type: "weekday" },
    { label: "木", type: "weekday" },
    { label: "金", type: "weekday" },
    { label: "土", type: "saturday" },
    { label: "日", type: "sunday" }
];

// 曜日行描画
function renderWeekdays() {
    const container = document.getElementById("calendarWeekdays");
    if (!container) return;
    container.innerHTML = "";
    weekdays.forEach(wd => {
        const div = document.createElement("div");
        div.innerText = wd.label;
        div.className = wd.type;
        container.appendChild(div);
    });
}

function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    const year = current.getFullYear();
    const month = current.getMonth();
    const diary = loadDiary();

    document.getElementById("monthTitle").innerText = `${year}年 ${month + 1}月`;

    // 月曜始まりに変換
    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = "";

    // 空白セル
    for (let i = 0; i < firstDay; i++) {
        grid.appendChild(document.createElement("div"));
    }

    // 日付セル
    for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";

        const dateKey = `${year}-${String(month + 1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        cell.innerText = d;

        // 日記がある場合にチェック
        if (diary[dateKey]) cell.classList.add("day-has-entry");

        // 曜日取得（月曜始まり）
        const dayOfWeek = (new Date(year, month, d).getDay() + 6) % 7;
        if (weekdays[dayOfWeek].type === "saturday") cell.classList.add("day-saturday");
        if (weekdays[dayOfWeek].type === "sunday") cell.classList.add("day-sunday");

        cell.onclick = () => {
            location.href = `detail.html?date=${dateKey}`;
        };

        grid.appendChild(cell);
    }
}

// 前月・翌月
function prevMonth() {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
}

// 初期描画
renderWeekdays();
renderCalendar();
/* ============================================================
   3) detail.html（詳細画面） ----------------------------------------
   ============================================================ */
if (location.pathname.includes("detail.html")) {
    const params = new URLSearchParams(location.search);
    let dateKey = params.get("date");
    let dateObj = new Date(dateKey);
    const weekdays = ["日","月","火","水","木","金","土"];

    const dateCenterEl = document.getElementById("dateCenter");
    const memoEl = document.getElementById("memoText");

    // 日付表示・メモ更新関数
    function updateDetail() {
        dateCenterEl.textContent = `${dateObj.getFullYear()}年${dateObj.getMonth()+1}月${dateObj.getDate()}日（${weekdays[dateObj.getDay()]}）`;
        const diary = loadDiary();
        memoEl.value = diary[dateKey] || "";
    }

    // 初期表示
    updateDetail();

    // 保存処理
    window.saveMemo = () => {
        const diary = loadDiary();
        diary[dateKey] = memoEl.value;
        saveDiary(diary);
        alert("保存しました");
    };

    // 戻るボタン
    window.goBack = () => {
        location.href = "index.html";
    };

    // 前日移動
    window.prevDay = () => {
        dateObj.setDate(dateObj.getDate() - 1);
        dateKey = dateObj.toISOString().split("T")[0];
        updateDetail();
    };

    // 翌日移動
    window.nextDay = () => {
        dateObj.setDate(dateObj.getDate() + 1);
        dateKey = dateObj.toISOString().split("T")[0];
        updateDetail();
    };
}
