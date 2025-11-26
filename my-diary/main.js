/* ============================================================
   日記アプリ ロジックファイル
   ・カレンダー生成
   ・LocalStorage保存
   ・詳細画面遷移
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
   2) index.html（カレンダー画面） ---------------------------------
   ============================================================ */
let current = new Date();

function renderCalendar() {
    if (!document.getElementById("calendarGrid")) return;

    const year = current.getFullYear();
    const month = current.getMonth();

    document.getElementById("monthTitle").innerText = `${year}年 ${month + 1}月`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();

    const diary = loadDiary();
    const grid = document.getElementById("calendarGrid");
    grid.innerHTML = "";

    // 空白（1日の曜日まで）
    for (let i = 0; i < firstDay; i++) {
        let cell = document.createElement("div");
        grid.appendChild(cell);
    }

    // 日付セル
    for (let d = 1; d <= lastDate; d++) {
        let cell = document.createElement("div");
        cell.className = "day-cell";

        const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

        cell.innerText = d;

        // 記録がある日には ✔ を表示
        if (diary[dateKey]) {
            cell.classList.add("day-has-entry");
        }

        // 詳細画面に遷移
        cell.onclick = () => {
            location.href = `detail.html?date=${dateKey}`;
        };

        grid.appendChild(cell);
    }
}

function prevMonth() {
    current.setMonth(current.getMonth() - 1);
    renderCalendar();
}

function nextMonth() {
    current.setMonth(current.getMonth() + 1);
    renderCalendar();
}

renderCalendar();



/* ============================================================
   3) detail.html（詳細画面） ----------------------------------------
   ============================================================ */
if (location.pathname.includes("detail.html")) {
    const params = new URLSearchParams(location.search);
    const dateKey = params.get("date");
    const header = document.getElementById("detailHeader");

    // 日付表示（YYYY年MM月DD日（曜））
    const dateObj = new Date(dateKey);
    const youbi = ["日","月","火","水","木","金","土"][dateObj.getDay()];
    header.innerText = `${dateObj.getFullYear()}年${dateObj.getMonth() + 1}月${dateObj.getDate()}日（${youbi}）`;

    // メモ読み込み
    const diary = loadDiary();
    document.getElementById("memoText").value = diary[dateKey] || "";

    // 保存処理
    window.saveMemo = () => {
        const diary = loadDiary();
        diary[dateKey] = document.getElementById("memoText").value;
        saveDiary(diary);
        alert("保存しました");
    };

    // 戻る
    window.goBack = () => {
        location.href = "index.html";
    };
}
