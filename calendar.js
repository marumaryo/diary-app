let current = new Date(); // カレンダー表示基準

// 祝日データ（そのまま）
const holidays = {
  "2025-01-01": "元日",
  "2025-01-13": "成人の日",
  "2025-02-11": "建国記念の日",
  "2025-03-21": "春分の日",
  "2025-04-29": "昭和の日",
  "2025-05-03": "憲法記念日",
  "2025-05-04": "みどりの日",
  "2025-05-05": "こどもの日",
  "2025-07-21": "海の日",
  "2025-09-15": "敬老の日",
  "2025-09-23": "秋分の日",
  "2025-10-13": "体育の日",
  "2025-11-03": "文化の日",
  "2025-11-23": "勤労感謝の日",
  "2025-11-24": "振替休日（勤労感謝の日）",
  "2025-12-23": "天皇誕生日",
  
  "2026-01-01": "元日",
  "2026-01-12": "成人の日",
  "2026-02-11": "建国記念の日",
  "2026-03-20": "春分の日",
  "2026-04-29": "昭和の日",
  "2026-05-03": "憲法記念日",
  "2026-05-04": "みどりの日",
  "2026-05-05": "こどもの日",
  "2026-07-20": "海の日",
  "2026-09-21": "敬老の日",
  "2026-09-23": "秋分の日",
  "2026-10-12": "体育の日",
  "2026-11-03": "文化の日",
  "2026-11-23": "勤労感謝の日",
  "2026-12-23": "天皇誕生日"
};

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

// Firebaseから日記読み込み（非同期）
async function loadDiary() {
    try {
        const snap = await window.db.collection("diary").doc("entries").get();
        if (snap.exists) return snap.data();
        return {};
    } catch(e) {
        console.error("loadDiaryエラー:", e);
        return {};
    }
}

// カレンダー描画（非同期対応）
async function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    const year = current.getFullYear();
    const month = current.getMonth();
    const diary = await loadDiary();

    document.getElementById("monthTitle").innerText = `${year}年 ${month+1}月`;

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7; // 月曜始まり
    const lastDate = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = "";

    // 空白セル
    for (let i = 0; i < firstDay; i++) grid.appendChild(document.createElement("div"));

    const todayStr = window.TODAY.iso;

    for (let d = 1; d <= lastDate; d++) {
        const cell = document.createElement("div");
        cell.className = "day-cell";

        const dateKey = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
        cell.innerText = d;

        // 今日判定
        if (dateKey === todayStr) cell.classList.add("day-today");

        // 日記チェック
        if (diary[dateKey]) cell.classList.add("day-has-entry");

        // 曜日判定
        const dayOfWeek = (new Date(year, month, d).getDay() + 6) % 7;
        if (weekdays[dayOfWeek].type === "saturday") cell.classList.add("day-saturday");
        if (weekdays[dayOfWeek].type === "sunday") cell.classList.add("day-sunday");

        // 祝日判定
        if (holidays[dateKey]) {
            cell.classList.add("day-holiday");
            cell.title = holidays[dateKey];
        }

        // クリックで詳細ページ
        cell.onclick = () => location.href = `detail.html?date=${dateKey}`;

        grid.appendChild(cell);
    }
}

// 前月・翌月
function prevMonth() { current.setMonth(current.getMonth() - 1); renderCalendar(); }
function nextMonth() { current.setMonth(current.getMonth() + 1); renderCalendar(); }

// 初期描画
document.addEventListener("DOMContentLoaded", () => {
    renderWeekdays();
    // 非同期関数はここで呼び出す
    (async () => {
        await renderCalendar();
    })();
});
