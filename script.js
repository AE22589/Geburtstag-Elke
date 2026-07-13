const birthday = new Date("2026-07-26T00:00:00");

const countdownPage = document.getElementById("countdownPage");
const giftPage = document.getElementById("giftPage");

function updateCountdown(){

    const now = new Date();

    const diff = birthday - now;

    if(diff <= 0){

        countdownPage.style.display="none";
        giftPage.style.display="block";

        return;
    }

    const days=Math.floor(diff/1000/60/60/24);

    const hours=Math.floor(diff/1000/60/60)%24;

    const minutes=Math.floor(diff/1000/60)%60;

    const seconds=Math.floor(diff/1000)%60;

    document.getElementById("days").textContent=days;
    document.getElementById("hours").textContent=hours;
    document.getElementById("minutes").textContent=minutes;
    document.getElementById("seconds").textContent=seconds;

}

updateCountdown();

setInterval(updateCountdown,1000);