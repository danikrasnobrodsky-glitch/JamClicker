import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");
var points = get("div", "points");
let score: number = 0;
var token = localStorage.getItem("userToken");

// --- Times that I brought it ---
let pointsPerSecond5: number = 0;
let pointsPerSecond6: number = 0;
let pointsPerSecond7: number = 0;


var lastLoginScore = await send<number | null>("getScore", token);

if (lastLoginScore == null) {
    localStorage.removeItem("userToken");
    location.href = "/website/pages/FirstPage.html";
    throw new Error();
}

score = lastLoginScore;
points.innerText = score + "₹";

// --- Add the Items to the Upgrades.ts---
var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);
var lastLoginFarm = await send<number>("getFarmItem", token);

if (lastLoginCursor > 0) {
    pointsPerSecond5 = lastLoginCursor * 1; 
    

    setInterval(async () => {
        score += pointsPerSecond5;
        points.innerText = score + "₹";

        await send("addScore", token, pointsPerSecond5);
    }, 1000);
}

if (lastLoginGrandma > 0) {
    pointsPerSecond6 = lastLoginGrandma * 1; 
    

    setInterval(async () => {
        score += pointsPerSecond6;
        points.innerText = score + "₹";
        
        await send("addScore", token, pointsPerSecond6);
    }, 1000);
}

if (lastLoginFarm > 0) {
    pointsPerSecond7 = lastLoginFarm * 1; 
    

    setInterval(async () => {
        score += pointsPerSecond7;
        points.innerText = score + "₹";
        
        await send("addScore", token, pointsPerSecond7);
    }, 1000);
}



if (backButton) {
    backButton.onclick = function() {
        window.location.href = 'Game.html';
    };
}

