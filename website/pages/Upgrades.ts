import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");

var points = get("div", "points");
let score: number = 0;
var token = localStorage.getItem("userToken");

var Buy1 = get("button", "buy1");
var Item1 = get("div", "Item1");

var hasPurchasedBuy1 = await send<boolean>("getDoubleClick", token);

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





if (hasPurchasedBuy1) {
    Item1?.remove();
}

Buy1?.addEventListener("click", async () => {
    if (score >= 150) {
        // Deduct points locally and on the server
        score -= 150;
        points.innerText = score + "₹";
        await send("addScore", token, -150); 

        // Tell the server this upgrade is now purchased permanently
        await send("addDoubleClick", token);

        // Run fade animation and remove item from the screen
        Item1?.classList.add("collapse-and-fade");
        setTimeout(() => {
            Item1?.remove();
        }, 400);
    } else {
        alert("You need at least 150₹ to buy this item!");
    }
});




if (backButton) {
    backButton.onclick = function() {
        window.location.href = 'Game.html';
    };
}

