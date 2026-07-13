// ===============================
// Geburtstag
// ===============================

const birthday = new Date("2026-07-26T00:00:00");

// ===============================
// Elemente
// ===============================

const countdownPage = document.getElementById("countdownPage");
const giftPage = document.getElementById("giftPage");

const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");

const adminModal = document.getElementById("adminModal");
const adminCode = document.getElementById("adminCode");
const adminButton = document.getElementById("adminButton");

// ===============================
// Countdown
// ===============================

function openGiftPage() {

    countdownPage.style.display = "none";
    giftPage.style.display = "flex";

}

function updateCountdown() {

    const now = new Date();

    const diff = birthday - now;

    if (diff <= 0) {

        openGiftPage();
        return;

    }

    const d = Math.floor(diff / 1000 / 60 / 60 / 24);
    const h = Math.floor(diff / 1000 / 60 / 60) % 24;
    const m = Math.floor(diff / 1000 / 60) % 60;
    const s = Math.floor(diff / 1000) % 60;

    days.textContent = d;
    hours.textContent = h;
    minutes.textContent = m;
    seconds.textContent = s;

}

updateCountdown();

setInterval(updateCountdown, 1000);

// ===============================
// Adminmodus
// ===============================

let clickCounter = 0;

document.body.addEventListener("click", (event) => {

    // Nicht mitzählen, wenn das Adminfenster offen ist
    if (adminModal.style.display === "flex") return;

    // Nicht mitzählen wenn Countdown bereits vorbei
    if (countdownPage.style.display === "none") return;

    clickCounter++;

    if (clickCounter >= 5) {

        clickCounter = 0;

        adminModal.style.display = "flex";

        adminCode.value = "";
        adminCode.focus();

    }

});

// ===============================
// Login
// ===============================

function checkAdminCode() {

    if (adminCode.value === "1337") {

        adminModal.style.display = "none";

        openGiftPage();

    } else {

        adminCode.value = "";

        adminCode.placeholder = "Falscher Code";

    }

}

adminButton.addEventListener("click", checkAdminCode);

adminCode.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {

        checkAdminCode();

    }

});

// ===============================
// Fenster schließen
// ===============================

adminModal.addEventListener("click", function (event) {

    if (event.target === adminModal) {

        adminModal.style.display = "none";

    }

});

// ===============================
// Platzhalter für später
// ===============================

document.getElementById("openGift").addEventListener("click", function () {

    alert("Hier beginnt bald das Geburtstagsabenteuer 🦀");

});