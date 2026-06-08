import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");
var sound = get("audio", "click-sound");
var sound2 = get("audio", "click-sound2");

var Cover5 = get("div", "Cover5");
var Cover6 = get("div", "Cover6");

var SummeryInfo5 = get("div", "Summery5");
var SummeryInfo6 = get("div", "Summery6");


var buy5 = get("div", "buy5");
var buy6 = get("div", "buy6");

var itemName5 = get("div", "item-name5");
var itemName6 = get("div", "item-name6");

var token = localStorage.getItem("userToken");
var score = await send<number | null>("getScore", token);

var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);

var scoreDiv = get("div", "points");
var priceDiv5 = get("div", "Price5");
var priceDiv6 = get("div", "Price6");

let CursorItem: number = lastLoginCursor; 
let currentPrice5: number = Math.round(25 * Math.pow(1.18, CursorItem)); 
let pointsPerSecond5: number = CursorItem * 1;

let GrandmaItem: number = lastLoginGrandma; 
let currentPrice6: number = Math.round(100 * Math.pow(1.18, GrandmaItem)); 
let pointsPerSecond6: number = GrandmaItem * 2;


if (itemName5) itemName5.innerText = CursorItem + " - Cursors";
if (priceDiv5) priceDiv5.textContent = currentPrice5 + "₹";

if (itemName6) itemName6.innerText = GrandmaItem + " - Grandmas";
if (priceDiv6) priceDiv6.textContent = currentPrice6 + "₹";


if (SummeryInfo5) {SummeryInfo5.innerText = CursorItem + " cursors producing " + pointsPerSecond5 + " jams per second.";}
    
if (SummeryInfo6) {SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + pointsPerSecond6 + " jams pre-second.";}

// if (scoreDiv && score !== null) {
//     scoreDiv.innerText = score + "₹";
// }

    

function updatePriceColor() {
    if (!buy5) return;

    if (score === null || score < currentPrice5) {
        Cover5.classList.add("not-enough-points");
    } else {
        Cover5.classList.remove("not-enough-points");
    }

    if (!buy6) return;

    if (score === null || score < currentPrice6) {
        Cover6.classList.add("not-enough-points");
    } else {
        Cover6.classList.remove("not-enough-points");
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
    if (scoreDiv) {
        scoreDiv.textContent = score + "₹"; // Added "₹" here
    }
    if (scoreDiv) {
        scoreDiv.textContent = String(score);
    }
    
    await updateScoreBackend(-currentPrice5);
    await updateCursor(1); 

    pointsPerSecond5 = CursorItem * 1;
    currentPrice5 = Math.round(25 * Math.pow(1.18, CursorItem));
    
    if (priceDiv5) {
        priceDiv5.textContent = currentPrice5 + "₹";
    }

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

    // 1. Deduct score locally and on backend
    score -= currentPrice6;
    if (scoreDiv) {
    scoreDiv.textContent = score + "₹"; // Added "₹" here
    }
    if (scoreDiv) {
        scoreDiv.textContent = String(score);
    }
    await updateScoreBackend(-currentPrice6);
    
    // 2. Update the Grandma count (This handles UI and saves to backend)
    await updateGrandma(1); 



    // 3. NOW calculate the new price using the newly updated GrandmaItem count
    currentPrice6 = Math.round(100 * Math.pow(1.18, GrandmaItem));
    
    if (priceDiv6) {
        priceDiv6.textContent = currentPrice6 + "₹";
    }

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
    // Calculate the new points per second BEFORE updating the text
    pointsPerSecond5 = CursorItem * 1; 

    if (itemName5) {
        itemName5.innerText = CursorItem + " - Cursors";
    }
    
    // Fix typo ("pre-second" -> "per second") and add spaces
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
        SummeryInfo6.innerText = GrandmaItem + " grandmas producing " + pointsPerSecond6 + " jams per second.";
    }

    await send("addGrandmaItem", token, add);
}

if (backButton) {
    backButton.onclick = function() {
        window.location.href = 'Game.html';
    };
}