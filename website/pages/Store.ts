import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");
var sound = get("audio", "click-sound");
var sound2 = get("audio", "click-sound2");

var Cover5 = get("div", "Cover5");
var Cover6 = get("div", "Cover6");
var Cover7 = get("div", "Cover7");
var Cover8 = get("div", "Cover8");

var SummeryInfo5 = get("div", "Summery5");
var SummeryInfo6 = get("div", "Summery6");
var SummeryInfo7 = get("div", "Summery7");
var SummeryInfo8 = get("div", "Summery8");

var buy5 = get("div", "buy5");
var buy6 = get("div", "buy6");
var buy7 = get("div", "buy7");
var buy8 = get("div", "buy8");

var itemName5 = get("div", "item-name5");
var itemName6 = get("div", "item-name6");
var itemName7 = get("div", "item-name7");
var itemName8 = get("div", "item-name8");

var token = localStorage.getItem("userToken");
var score = await send<number | null>("getScore", token);

var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);
var lastLoginFarm = await send<number>("getFarmItem", token);
var lastLoginVillage = await send<number>("getVillageItem", token);

var scoreDiv = get("div", "points");
var priceDiv5 = get("div", "Price5");
var priceDiv6 = get("div", "Price6");
var priceDiv7 = get("div", "Price7");
var priceDiv8 = get("div", "Price8");

let CursorItem: number = lastLoginCursor;
let currentPrice5: number = Math.round(25 * Math.pow(1.17, CursorItem));
let pointsPerSecond5: number = CursorItem * 1;

let GrandmaItem: number = lastLoginGrandma;
let currentPrice6: number = Math.round(100 * Math.pow(1.17, GrandmaItem));
let pointsPerSecond6: number = GrandmaItem * 2;

let FarmItem: number = lastLoginFarm;
let currentPrice7: number = Math.round(1000 * Math.pow(1.16, FarmItem));
let pointsPerSecond7: number = FarmItem * 5;


let VillageItem: number = lastLoginVillage;
let currentPrice8: number = Math.round(10000 * Math.pow(1.15, VillageItem));
let pointsPerSecond8: number = VillageItem * 15;


function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
}


if (itemName5) itemName5.innerText = CursorItem + " - Cursors";
if (priceDiv5) priceDiv5.textContent = formatNumber(currentPrice5) + "₹";

if (itemName6) itemName6.innerText = GrandmaItem + " - Grandmas";
if (priceDiv6) priceDiv6.textContent = formatNumber(currentPrice6) + "₹";

if (itemName7) itemName7.innerText = FarmItem + " - Farms";
if (priceDiv7) priceDiv7.textContent = formatNumber(currentPrice7) + "₹";

if (itemName8) itemName8.innerText = VillageItem + " - Villages";
if (priceDiv8) priceDiv8.textContent = formatNumber(currentPrice8) + "₹";

if (SummeryInfo5) { SummeryInfo5.innerText = CursorItem + " cursors producing " + formatNumber(pointsPerSecond5) + " jams per second."; }
if (SummeryInfo6) { SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + formatNumber(pointsPerSecond6) + " jams per second."; }
if (SummeryInfo7) { SummeryInfo7.innerText = FarmItem + " farms producing " + formatNumber(pointsPerSecond7) + " jams per second."; }
if (SummeryInfo8) { SummeryInfo8.innerText = VillageItem + " villages producing " + formatNumber(pointsPerSecond8) + " jams per second."; }

function updatePriceColor() {
    if (Cover5) {
        if (score === null || score < currentPrice5) {
            Cover5.classList.add("not-enough-points");
        } else {
            Cover5.classList.remove("not-enough-points");
        }
    }

    if (Cover6) {
        if (score === null || score < currentPrice6) {
            Cover6.classList.add("not-enough-points");
        } else {
            Cover6.classList.remove("not-enough-points");
        }
    }

    if (Cover7) {
        if (score === null || score < currentPrice7) {
            Cover7.classList.add("not-enough-points");
        } else {
            Cover7.classList.remove("not-enough-points");
        }
    }

    if (Cover8) {
        if (score === null || score < currentPrice8) {
            Cover8.classList.add("not-enough-points");
        } else {
            Cover8.classList.remove("not-enough-points");
        }
    }
}

async function loadScore() {
    if (!scoreDiv) {
        console.error("Score container element not found");
        return;
    }

    try {
        score = await send<number | null>("getScore", token);
        scoreDiv.textContent = score !== null ? score + "₹" : "No score available";
        updatePriceColor();
    } catch (error) {
        console.error("Failed to fetch score:", error);
        scoreDiv.textContent = "Error loading score";
    }
}

await loadScore();


setInterval(async () => {
    if (score === null) return;

    let totalNewPoints = pointsPerSecond5 + pointsPerSecond6 + pointsPerSecond7;

    if (totalNewPoints > 0) {
        score += totalNewPoints;
        if (scoreDiv) {
            scoreDiv.textContent = score + "₹";
        }
        updatePriceColor();
        await updateScoreBackend(totalNewPoints);
    }
}, 1000);



buy5.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice5) {
        if (priceDiv5) {
            priceDiv5.classList.remove("shake");
            void priceDiv5.offsetWidth;
            priceDiv5.classList.add("shake");
        }
        if(sound){
            sound.volume = 0.25;
            sound.currentTime = 0;
            sound.play();
        }
        return;
    }
    sound2.volume = 0.35;
    sound2.currentTime = 0;
    sound2.play();

    score -= currentPrice5;
    if (scoreDiv) scoreDiv.textContent = formatNumber(score) + "₹";

    await updateScoreBackend(-currentPrice5);
    await updateCursor(1);

    currentPrice5 = Math.round(25 * Math.pow(1.17, CursorItem));
    if (priceDiv5) priceDiv5.textContent = formatNumber(currentPrice5) + "₹";

    updatePriceColor();
});

buy6.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice6) {
        if (priceDiv6) {
            priceDiv6.classList.remove("shake");
            void priceDiv6.offsetWidth;
            priceDiv6.classList.add("shake");
        }
        if(sound){
            sound.volume = 0.25;
            sound.currentTime = 0;
            sound.play();
        }
        return;
    }
    sound2.volume = 0.35;
    sound2.currentTime = 0;
    sound2.play();

    score -= currentPrice6;
    if (scoreDiv) scoreDiv.textContent = formatNumber(score) + "₹";

    await updateScoreBackend(-currentPrice6);
    await updateGrandma(1);

    currentPrice6 = Math.round(100 * Math.pow(1.17, GrandmaItem));
    if (priceDiv6) priceDiv6.textContent = formatNumber(currentPrice6) + "₹";

    updatePriceColor();
});


buy7.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice7) { 
        if (priceDiv7) {
            priceDiv7.classList.remove("shake");
            void priceDiv7.offsetWidth;
            priceDiv7.classList.add("shake");
        }
        if(sound){
            sound.volume = 0.25;
            sound.currentTime = 0;
            sound.play();
        }
        return;
    }
    sound2.volume = 0.35;
    sound2.currentTime = 0;
    sound2.play();

    score -= currentPrice7;
    if (scoreDiv) scoreDiv.textContent = formatNumber(score) + "₹";

    await updateScoreBackend(-currentPrice7);
    await updateFarm(1);

    currentPrice7 = Math.round(1000 * Math.pow(1.16, FarmItem));
    if (priceDiv7) priceDiv7.textContent = formatNumber(currentPrice7) + "₹";

    updatePriceColor();
});

buy8.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice8) { 
        if (priceDiv8) {
            priceDiv8.classList.remove("shake");
            void priceDiv8.offsetWidth;
            priceDiv8.classList.add("shake");
        }
        if(sound){
            sound.volume = 0.25;
            sound.currentTime = 0;
            sound.play();
        }
        return;
    }
    sound2.volume = 0.35;
    sound2.currentTime = 0;
    sound2.play();

    score -= currentPrice8;
    if (scoreDiv) scoreDiv.textContent = formatNumber(score) + "₹";

    await updateScoreBackend(-currentPrice8);
    await updateVillage(1);

    currentPrice8 = Math.round(10000 * Math.pow(1.15, VillageItem));
    if (priceDiv8) priceDiv8.textContent = formatNumber(currentPrice8) + "₹";

    updatePriceColor();
});


async function updateScoreBackend(amount: number) {
    if (!token) return;
    try {
        await send("addScore", token, amount);
    } catch (error) {
        console.error("Failed to update score on backend:", error);
    }
}

async function updateCursor(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }
    CursorItem += add;
    pointsPerSecond5 = CursorItem * 1;

    if (itemName5) {
        itemName5.innerText = CursorItem + " - Cursors";
    }

    if (SummeryInfo5) {
        SummeryInfo5.innerText = CursorItem + " cursors producing " + formatNumber(pointsPerSecond5) + " jams per second.";
    }

    await send("addCursorItem", token, add);
}

async function updateGrandma(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }
    GrandmaItem += add;
    pointsPerSecond6 = GrandmaItem * 2;

    if (itemName6) {
        itemName6.innerText = GrandmaItem + " - Grandmas";
    }

    if (SummeryInfo6) {
        SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + formatNumber(pointsPerSecond6) + " jams per second.";
    }

    await send("addGrandmaItem", token, add);
}

async function updateFarm(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }
    FarmItem += add;
    pointsPerSecond8 = FarmItem * 5;

    if (itemName7) {
        itemName7.innerText = FarmItem + " - Farms";
    }

    if (SummeryInfo7) {
        SummeryInfo7.innerText = FarmItem + " farms producing " + formatNumber(pointsPerSecond7) + " jams per second.";
    }

    await send("addFarmItem", token, add);
}

async function updateVillage(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }
    VillageItem += add;
    pointsPerSecond8 = VillageItem * 15;

    if (itemName8) {
        itemName8.innerText = VillageItem + " - Villages";
    }

    if (SummeryInfo8) {
        SummeryInfo8.innerText = VillageItem + " villages producing " + formatNumber(pointsPerSecond8) + " jams per second.";
    }

    await send("addVillageItem", token, add);
}

if (backButton) {
    backButton.onclick = function () {
        window.location.href = 'Game.html';
    };
}