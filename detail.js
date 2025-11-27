/* detail.js detail.html専用 */

document.addEventListener("DOMContentLoaded", () => {

    const params = new URLSearchParams(location.search);
    let dateKey = params.get("date");
    let dateObj = new Date(dateKey);
    const weekdays = ["日","月","火","水","木","金","土"];

    const dateCenterEl = document.getElementById("dateCenter");
    const memoEl = document.getElementById("memoText");

    async function loadDiary() {
        try {
            const snap = await window.db.collection("diary").doc("entries").get();
            if(snap.exists) return snap.data();
            return {};
        } catch(e) {
            console.error("loadDiaryエラー:", e);
            return {};
        }
    }

    async function saveDiary(dateKey, content) {
        try {
            await window.db.collection("diary").doc("entries").set(
                { [dateKey]: content },
                { merge:true }
            );
            console.log("保存成功:", dateKey, content);
        } catch(e) {
            console.error("saveDiaryエラー:", e);
        }
    }

    async function updateDetail() {
        const diary = await loadDiary();
        dateCenterEl.textContent = `${dateObj.getFullYear()}年${dateObj.getMonth()+1}月${dateObj.getDate()}日（${weekdays[dateObj.getDay()]}）`;
        memoEl.value = diary[dateKey] || "";
    }

    updateDetail();

    window.saveMemo = async () => {
        await saveDiary(dateKey, memoEl.value);
        alert("保存しました");
    };

    window.goBack = () => location.href = "index.html";

    window.prevDay = async () => {
        dateObj.setDate(dateObj.getDate()-1);
        dateKey = dateObj.toISOString().split("T")[0];
        await updateDetail();
    };

    window.nextDay = async () => {
        dateObj.setDate(dateObj.getDate()+1);
        dateKey = dateObj.toISOString().split("T")[0];
        await updateDetail();
    };

});
