import { send } from "clientUtilities";
import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");
var sound = get("audio", "click-sound");
var Shop = get("button", "Shop");

let score: number = 0;

var token = localStorage.getItem("userToken");

BigJam.addEventListener('click', (): void => {
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



Shop.onclick = function() {
    window.location.href = 'Store.html';
};