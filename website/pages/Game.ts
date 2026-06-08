import { send } from "clientUtilities";
import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");
var sound = get("audio", "click-sound");
var Shop = get("button", "Shop");
var Upgrades = get("button", "Upgrades");

let score: number = 0;
var cooldownTime = 100;
var token = localStorage.getItem("userToken");

// --- Times that I brought it ---
let pointsPerSecond5: number = 0;
let pointsPerSecond6: number = 0;


BigJam.addEventListener('click', (): void => {
    if (BigJam.classList.contains('cooldown')) return;
    BigJam.classList.add('cooldown');

    setTimeout(() => {
        BigJam.classList.remove('cooldown');
    }, cooldownTime);

    sound.volume = 0.55;
    sound.currentTime = 0;
    sound.play();
    void updateScore(1);
});

async function updateScore(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    score += add;
    points.innerText = "Jams: " + score;
    await send("addScore", token, add);
}

var lastLoginScore = await send<number | null>("getScore", token);

if (lastLoginScore == null) {
    localStorage.removeItem("userToken");
    location.href = "/website/pages/FirstPage.html";
    throw new Error();
}

score = lastLoginScore;
points.innerText = "Jams: " + score;


// --- Add the Items to the Game.ts---
var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);

if (lastLoginCursor > 0) {
    pointsPerSecond5 = lastLoginCursor * 1; 
    

    setInterval(async () => {
        score += pointsPerSecond5;
        points.innerText = "Jams: " + score;

        await send("addScore", token, pointsPerSecond5);
    }, 1000);
}

if (lastLoginGrandma > 0) {
    pointsPerSecond6 = lastLoginGrandma * 1; 
    

    setInterval(async () => {
        score += pointsPerSecond6;
        points.innerText = "Jams: " + score;
        
        await send("addScore", token, pointsPerSecond6);
    }, 1000);
}

Shop.onclick = function() {
    window.location.href = 'Store.html';
};

Upgrades.onclick = function() {
    window.location.href = 'Upgrades.html';
};