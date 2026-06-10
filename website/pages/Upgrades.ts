import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");
var points = get("div", "points");
let score: number = 0;
var token = localStorage.getItem("userToken");


var lastLoginScore = await send<number | null>("getScore", token);

if (lastLoginScore == null) {
    localStorage.removeItem("userToken");
    location.href = "/website/pages/FirstPage.html";
    throw new Error();
}

score = lastLoginScore;
points.innerText = score + "₹";

if (backButton) {
    backButton.onclick = function() {
        window.location.href = 'Game.html';
    };
}