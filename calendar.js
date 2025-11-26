let current = new Date();       // カレンダー表示基準
let holidays = {};              // 祝日情報（JSON）

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

// カレンダー描画
function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;

    const year = current.getFullYear();
    const month = current.getMonth();
    const diary = loadDiary();

    document.getElementById("monthTitle").innerText = `${year}年 ${month+1}月`;

    const firstDay = (new Date(year, month, 1).getDay() + 6) % 7;
    const lastDate = new Date(year, month + 1, 0).getDate();

    grid.innerHTML = "";

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

        cell.onclick = () => location.href = `detail.html?date=${dateKey}`;

        grid.appendChild(cell);
    }
}

// 前月・翌月
function prevMonth() { current.setMonth(current.getMonth() - 1); renderCalendar(); }
function nextMonth() { current.setMonth(current.getMonth() + 1); renderCalendar(); }

// 初期描画
renderWeekdays();

// 祝日JSON取得
fetch("holidays.json")
    .then(res => res.json())
    .then(data => { holidays = data; renderCalendar(); })
    .catch(err => { console.error(err); holidays = {}; renderCalendar(); });
