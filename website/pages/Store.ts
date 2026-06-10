import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");
var sound = get("audio", "click-sound");
var sound2 = get("audio", "click-sound2");

var Cover5 = get("div", "Cover5");
var Cover6 = get("div", "Cover6");
var Cover7 = get("div", "Cover7");

var SummeryInfo5 = get("div", "Summery5");
var SummeryInfo6 = get("div", "Summery6");
var SummeryInfo7 = get("div", "Summery7");

var buy5 = get("div", "buy5");
var buy6 = get("div", "buy6");
var buy7 = get("div", "buy7");

var itemName5 = get("div", "item-name5");
var itemName6 = get("div", "item-name6");
var itemName7 = get("div", "item-name7");

var token = localStorage.getItem("userToken");
var score = await send<number | null>("getScore", token);

var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);
var lastLoginFarm = await send<number>("getFarmItem", token);

var scoreDiv = get("div", "points");
var priceDiv5 = get("div", "Price5");
var priceDiv6 = get("div", "Price6");
var priceDiv7 = get("div", "Price7");

let CursorItem: number = lastLoginCursor;
let currentPrice5: number = Math.round(25 * Math.pow(1.17, CursorItem));
let pointsPerSecond5: number = CursorItem * 1;

let GrandmaItem: number = lastLoginGrandma;
let currentPrice6: number = Math.round(100 * Math.pow(1.17, GrandmaItem));
let pointsPerSecond6: number = GrandmaItem * 2;

let FarmItem: number = lastLoginFarm;
let currentPrice7: number = Math.round(1000 * Math.pow(1.17, FarmItem));
let pointsPerSecond7: number = FarmItem * 5;


if (itemName5) itemName5.innerText = CursorItem + " - Cursors";
if (priceDiv5) priceDiv5.textContent = currentPrice5 + "₹";

if (itemName6) itemName6.innerText = GrandmaItem + " - Grandmas";
if (priceDiv6) priceDiv6.textContent = currentPrice6 + "₹";

if (itemName7) itemName7.innerText = FarmItem + " - Farms";
if (priceDiv7) priceDiv7.textContent = currentPrice7 + "₹";


if (SummeryInfo5) { SummeryInfo5.innerText = CursorItem + " cursors producing " + pointsPerSecond5 + " jams per second."; }

if (SummeryInfo6) { SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + pointsPerSecond6 + " jams pre-second."; }

if (SummeryInfo7) { SummeryInfo7.innerText = FarmItem + " farms producing " + pointsPerSecond7 + " jams pre-second."; }

// if (scoreDiv && score !== null) {
//     scoreDiv.innerText = score + "₹";
// }



function updatePriceColor() {
    // Cursor (Item 5)
    if (Cover5) {
        if (score === null || score < currentPrice5) {
            Cover5.classList.add("not-enough-points");
        } else {
            Cover5.classList.remove("not-enough-points");
        }
    }

    // Grandma (Item 6)
    if (Cover6) {
        if (score === null || score < currentPrice6) {
            Cover6.classList.add("not-enough-points");
        } else {
            Cover6.classList.remove("not-enough-points");
        }
    }

    // Farm (Item 7)
    if (Cover7) {
        if (score === null || score < currentPrice7) {
            Cover7.classList.add("not-enough-points");
        } else {
            Cover7.classList.remove("not-enough-points");
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
    if (score !== null && pointsPerSecond5 > 0) {
        score += pointsPerSecond5;
        if (scoreDiv) {
            scoreDiv.textContent = score + "₹";
        }
        updatePriceColor();
        await updateScoreBackend(pointsPerSecond5);
    }

    if (score !== null && pointsPerSecond6 > 0) {
        score += pointsPerSecond6;
        if (scoreDiv) {
            scoreDiv.textContent = score + "₹";
        }
        updatePriceColor();
        await updateScoreBackend(pointsPerSecond6);
    }

    if (score !== null && pointsPerSecond7 > 0) {
        score += pointsPerSecond7;
        if (scoreDiv) {
            scoreDiv.textContent = score + "₹";
        }
        updatePriceColor();
        await updateScoreBackend(pointsPerSecond7);
    }

}, 1000);


buy5.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice5) {
        if (priceDiv5) {
            priceDiv5.classList.remove("shake");
            void priceDiv5.offsetWidth;
            priceDiv5.classList.add("shake");
        }
        if (sound) {
            sound.volume = 0.30;
            sound.currentTime = 0;
            sound.play().catch(e => console.warn("Audio playback interrupted:", e));
        }
        return;
    }
    sound2.volume = 0.5;
    sound2.currentTime = 0;
    sound2.play().catch(e => console.warn("Audio playback interrupted:", e));

    score -= currentPrice5;
    if (scoreDiv) scoreDiv.textContent = score + "₹";

    await updateScoreBackend(-currentPrice5);
    await updateCursor(1);

    currentPrice5 = Math.round(25 * Math.pow(1.17, CursorItem));
    if (priceDiv5) priceDiv5.textContent = currentPrice5 + "₹";

    updatePriceColor();
});

buy6.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice6) {
        if (priceDiv6) {
            priceDiv6.classList.remove("shake");
            void priceDiv6.offsetWidth;
            priceDiv6.classList.add("shake");
        }
        if (sound) {
            sound.volume = 0.30;
            sound.currentTime = 0;
            sound.play().catch(e => console.warn("Audio playback interrupted:", e));
        }
        return;
    }
    sound2.volume = 0.5;
    sound2.currentTime = 0;
    sound2.play().catch(e => console.warn("Audio playback interrupted:", e));

    score -= currentPrice6;
    if (scoreDiv) scoreDiv.textContent = score + "₹";

    await updateScoreBackend(-currentPrice6);
    await updateGrandma(1);

    currentPrice6 = Math.round(100 * Math.pow(1.17, GrandmaItem));
    if (priceDiv6) priceDiv6.textContent = currentPrice6 + "₹";

    updatePriceColor();
});


buy7.addEventListener('click', async (): Promise<void> => {
    if (score === null || score < currentPrice7) { 
        if (priceDiv7) {
            priceDiv7.classList.remove("shake");
            void priceDiv7.offsetWidth;
            priceDiv7.classList.add("shake");
        }
        if (sound) {
            sound.volume = 0.30;
            sound.currentTime = 0;
            sound.play().catch(e => console.warn("Audio playback interrupted:", e));
        }
        return;
    }
    sound2.volume = 0.5;
    sound2.currentTime = 0;
    sound2.play().catch(e => console.warn("Audio playback interrupted:", e));

    score -= currentPrice7;
    if (scoreDiv) scoreDiv.textContent = score + "₹";

    await updateScoreBackend(-currentPrice7);
    await updateFarm(1);

    currentPrice7 = Math.round(1000 * Math.pow(1.17, FarmItem));
    if (priceDiv7) priceDiv7.textContent = currentPrice7 + "₹";

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
        SummeryInfo5.innerText = CursorItem + " cursors producing " + pointsPerSecond5 + " jams per second.";
    }

    await send("addCursorItem", token, add);
}

async function updateGrandma(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    GrandmaItem += add;
    pointsPerSecond6 = GrandmaItem * 1;

    if (itemName6) {
        itemName6.innerText = GrandmaItem + " - Grandmas";
    }

    if (SummeryInfo6) {
        SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + 2 * pointsPerSecond6 + " jams per second.";
    }

    await send("addGrandmaItem", token, add);
}

async function updateFarm(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    FarmItem += add;
    pointsPerSecond7 = FarmItem * 1;

    if (itemName7) {
        itemName7.innerText = FarmItem + " - Farms";
    }

    if (SummeryInfo7) {
        SummeryInfo7.innerText = FarmItem + " farms producing " + 5 * pointsPerSecond7 + " jams per second.";
    }

    await send("addFarmItem", token, add);
}

if (backButton) {
    backButton.onclick = function () {
        window.location.href = 'Game.html';
    };
}