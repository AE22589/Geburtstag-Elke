// ===============================
// Elemente
// ===============================

const birthday = new Date("2026-07-26T00:00:00");

const countdownPage = document.getElementById("countdownPage");
const memoryPage    = document.getElementById("memoryPage");
const voucherPage   = document.getElementById("voucherPage");

const adminModal  = document.getElementById("adminModal");
const adminButton = document.getElementById("adminButton");
const adminCode   = document.getElementById("adminCode");

const board    = document.getElementById("memoryBoard");
const confetti = document.getElementById("confetti");
const bgVideo  = document.getElementById("bgVideo");


// ===============================
// Hintergrundvideo
// ===============================
// Versucht das Video abzuspielen. Schlägt Autoplay fehl (z. B. iOS im
// Energiesparmodus), bleibt automatisch das Posterbild sichtbar.
// Zusätzlich wird beim ersten Tippen/Klicken erneut versucht zu starten.

if (bgVideo) {

    const tryPlayVideo = () => {

        const playPromise = bgVideo.play();

        if (playPromise !== undefined) {

            playPromise.catch(() => {

                const resumeOnInteraction = () => {

                    bgVideo.play().catch(() => {});

                    document.removeEventListener("touchstart", resumeOnInteraction);
                    document.removeEventListener("click", resumeOnInteraction);

                };

                document.addEventListener("touchstart", resumeOnInteraction, { once: true, passive: true });
                document.addEventListener("click", resumeOnInteraction, { once: true });

            });

        }

    };

    tryPlayVideo();

}


// ===============================
// Countdown
// ===============================
// Zum Testen ohne Warten auf den echten Geburtstag:
// index.html?test=memory   -> zeigt sofort das Memory-Spiel
// index.html?test=voucher  -> zeigt sofort die Gutscheinseite
// Der Parameter hat keinerlei Auswirkung, wenn er nicht in der
// URL steht - für Besucher ändert sich also nichts.

const testMode = new URLSearchParams(window.location.search).get("test");

function updateCountdown() {

    const now = new Date();
    const diff = birthday - now;

    if (diff <= 0 || testMode === "memory" || testMode === "voucher") {

        countdownPage.classList.add("hidden");

        if (testMode === "voucher") {

            voucherPage.classList.remove("hidden");
            launchConfetti();

        } else {

            memoryPage.classList.remove("hidden");

        }

        clearInterval(timer);

        return;

    }

    const days    = Math.floor(diff / 86400000);
    const hours   = Math.floor(diff % 86400000 / 3600000);
    const minutes = Math.floor(diff % 3600000 / 60000);
    const seconds = Math.floor(diff % 60000 / 1000);

    document.getElementById("days").textContent    = days;
    document.getElementById("hours").textContent   = hours;
    document.getElementById("minutes").textContent = minutes;
    document.getElementById("seconds").textContent = seconds;

}

updateCountdown();

const timer = setInterval(updateCountdown, 1000);


// ===============================
// Adminmodus
// ===============================

let taps = 0;

document.body.addEventListener("click", () => {

    taps++;

    if (taps >= 5) {

        taps = 0;

        adminModal.style.display = "flex";
        adminCode.focus();

    }

});

adminButton.addEventListener("click", () => {

    if (adminCode.value === "1337") {

        adminModal.style.display = "none";

        countdownPage.classList.add("hidden");
        memoryPage.classList.add("hidden");
        voucherPage.classList.remove("hidden");

        launchConfetti();

    } else {

        adminCode.value = "";
        alert("Falscher Code.");

    }

});

adminModal.addEventListener("click", (e) => {

    if (e.target === adminModal) {

        adminModal.style.display = "none";
        adminCode.value = "";

    }

});

adminCode.addEventListener("keydown", (e) => {

    if (e.key === "Enter") {

        adminButton.click();

    }

});


// ===============================
// Memory
// ===============================

const icons = [
    "🍕", "🍕",
    "🍷", "🍷",
    "❤️", "❤️",
    "🎂", "🎂",
    "🌸", "🌸",
    "🎁", "🎁"
];

icons.sort(() => Math.random() - 0.5);

let firstCard  = null;
let secondCard = null;
let lock       = false;
let matches    = 0;

createBoard();

function createBoard() {

    board.innerHTML = "";

    icons.forEach(icon => {

        const card = document.createElement("div");

        card.className = "memoryCard";
        card.dataset.icon = icon;

        card.innerHTML = `
            <div class="front">?</div>
            <div class="back">${icon}</div>
        `;

        card.addEventListener("click", flipCard);

        board.appendChild(card);

    });

}

function flipCard() {

    if (lock) return;
    if (this === firstCard) return;
    if (this.classList.contains("found")) return;

    this.classList.add("open");

    if (!firstCard) {

        firstCard = this;
        return;

    }

    secondCard = this;
    lock = true;

    if (firstCard.dataset.icon === secondCard.dataset.icon) {

        firstCard.classList.add("found");
        secondCard.classList.add("found");

        firstCard.removeEventListener("click", flipCard);
        secondCard.removeEventListener("click", flipCard);

        matches++;

        resetSelection();

        if (matches === 6) {

            setTimeout(() => {

                launchConfetti();

                memoryPage.classList.add("hidden");
                voucherPage.classList.remove("hidden");

            }, 900);

        }

    } else {

        setTimeout(() => {

            firstCard.classList.remove("open");
            secondCard.classList.remove("open");

            resetSelection();

        }, 900);

    }

}

function resetSelection() {

    firstCard  = null;
    secondCard = null;
    lock       = false;

}


// ===============================
// Konfetti
// ===============================

function launchConfetti() {

    confetti.innerHTML = "";

    for (let i = 0; i < 120; i++) {

        const piece = document.createElement("div");

        piece.className = "confettiPiece";

        piece.style.left = Math.random() * 100 + "%";
        piece.style.animationDelay = Math.random() * 2 + "s";
        piece.style.animationDuration = (3 + Math.random() * 3) + "s";
        piece.style.transform = "rotate(" + (Math.random() * 360) + "deg)";

        confetti.appendChild(piece);

    }

    setTimeout(() => {

        confetti.innerHTML = "";

    }, 7000);

}


// ===============================
// Kleine Fade-in Animation beim Laden
// ===============================

window.addEventListener("load", () => {

    document.body.style.opacity = "0";

    requestAnimationFrame(() => {

        document.body.style.transition = "opacity .8s ease";
        document.body.style.opacity = "1";

    });

});