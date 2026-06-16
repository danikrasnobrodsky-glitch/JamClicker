import { send } from "clientUtilities";
import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");
var sound = get("audio", "click-sound");
var Shop = get("button", "Shop");
var Upgrades = get("button", "Upgrades");

var openButton = get("button" , "openBtn1");
var closeButton = get("button" , "closeBtn1");
var popupOverlay = document.getElementById('popupOverlay') as HTMLDivElement;

var Arch1 = get("div", "Ach1");
var Arch2 = get("div", "Ach2");
var Arch3 = get("div", "Ach3");
var Arch4 = get("div", "Ach4");

var openProfileBtn = get("button", "openBtn2");
var closeProfileBtn = document.getElementById("closeProfileBtn") as HTMLButtonElement;
var profileOverlay = document.getElementById("profileOverlay") as HTMLDivElement;
var logoutBtn = document.getElementById("logoutBtn") as HTMLButtonElement;

let score: number = 0;
var cooldownTime = 90;
var token = localStorage.getItem("userToken");


// --- Times that I bought it ---
let pointsPerSecond5: number = 0;
let pointsPerSecond6: number = 0;
let pointsPerSecond7: number = 0;
let pointsPerSecond8: number = 0;


var NameDiv = get("div", "usernameDisplay");
var profileName = get("div", "profileName");
var PasswordDiv = get("div", "passwordDisplay");


let clickPower: number = 1;
var isBuy1Unlocked = await send<boolean>("getDoubleClick", token);

if (isBuy1Unlocked) {
    clickPower = 2;
}

// --- Visual Click Spots ---
BigJam.addEventListener('click', (event: MouseEvent): void => {
    var rect = BigJam.getBoundingClientRect();

    var clickX = event.clientX - rect.left;
    var clickY = event.clientY - rect.top;

    var spot = document.createElement('div') as HTMLDivElement;
    spot.classList.add('jam-spot');

    spot.style.left = `${clickX}px`;
    spot.style.top = `${clickY}px`;

    BigJam.appendChild(spot);

    setTimeout(() => {
        spot.remove();
    }, 1200);
});




BigJam.addEventListener('click', (): void => {
    if (BigJam.classList.contains('cooldown')) return;
    BigJam.classList.add('cooldown');

    setTimeout(() => {
        BigJam.classList.remove('cooldown');
    }, cooldownTime);

    sound.volume = 0.55;
    sound.currentTime = 0;
    sound.play();
    

    void updateScore(clickPower); 
});

// --- Score Updates & Live Achievement Checking ---
async function updateScore(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    score += add;
    points.innerText = score + "₹";
    

    updateAchievementsColor();

    await send("addScore", token, add);
}

async function loadName() {
    if (!NameDiv || !token) {
        return;
    }
    try {
        var userName = await send<string | null>("getUsername", token);

        NameDiv.textContent = userName ?? "Guest Player";

        profileName.textContent = "Hello, " + userName;
    }
    catch (error) {
        console.error(error);
        NameDiv.textContent = "Error loading name";
    }
}
await loadName();


async function loadPassword() {
    if (!PasswordDiv || !token) {
        return;
    }
    try {
        var password = await send<string | null>("getPassword", token);

        PasswordDiv.textContent = password ?? "No Password";
    }
    catch (error) {
        console.error(error);
        PasswordDiv.textContent = "Error loading password";
    }
}
await loadPassword();


function updateAchievementsColor() {
    if (!Arch1) return;
    if (score >= 1000) {
        Arch1.classList.remove("Achievements-locked");
    } else {
        Arch1.classList.add("Achievements-locked");
    }

    if (!Arch2) return;
    if (score >= 10000) {
        Arch2.classList.remove("Achievements-locked");
    } else {
        Arch2.classList.add("Achievements-locked");
    }
    
    if (!Arch3) return;
    if (score >= 100000) {
        Arch3.classList.remove("Achievements-locked");
    } else {
        Arch3.classList.add("Achievements-locked");
    }

    if (!Arch4) return;
    if (score >= 1000000) {
        Arch4.classList.remove("Achievements-locked");
    } else {
        Arch4.classList.add("Achievements-locked");
    }
}

openProfileBtn.addEventListener("click", () => {
    profileOverlay.classList.remove("hidden");
});

closeProfileBtn.addEventListener("click", () => {
    profileOverlay.classList.add("hidden");
});

profileOverlay.addEventListener("click", (event) => {
    if (event.target === profileOverlay) {
        profileOverlay.classList.add("hidden");
    }
});


logoutBtn.addEventListener("click", () => {
    window.location.href = 'SignIn.html';

});


var lastLoginScore = await send<number | null>("getScore", token);

if (lastLoginScore == null) {
    localStorage.removeItem("userToken");
    location.href = "/website/pages/FirstPage.html";
    throw new Error();
}

score = lastLoginScore;
points.innerText = score + "₹";
updateAchievementsColor();


// --- Passive Income Items ---
var lastLoginCursor = await send<number>("getCursorItem", token);
var lastLoginGrandma = await send<number>("getGrandmaItem", token);
var lastLoginFarm = await send<number>("getFarmItem", token);
var lastLoginVillage = await send<number>("getVillageItem", token);

if (lastLoginCursor > 0) {
    pointsPerSecond5 = lastLoginCursor * 1; 
    
    setInterval(async () => {
        score += pointsPerSecond5;
        points.innerText = score + "₹";
        updateAchievementsColor();

        await send("addScore", token, pointsPerSecond5);
    }, 1000);
}

if (lastLoginGrandma > 0) {
    pointsPerSecond6 = lastLoginGrandma * 2; 
    
    setInterval(async () => {
        score += pointsPerSecond6;
        points.innerText = score + "₹";
        updateAchievementsColor();
        
        await send("addScore", token, pointsPerSecond6);
    }, 1000);
}

if (lastLoginFarm > 0) {
    pointsPerSecond7 = lastLoginFarm * 5; 
    
    setInterval(async () => {
        score += pointsPerSecond7;
        points.innerText = score + "₹";
        updateAchievementsColor();
        
        await send("addScore", token, pointsPerSecond7);
    }, 1000);
}

if (lastLoginVillage > 0) {
    pointsPerSecond8 = lastLoginVillage * 15; 
    
    setInterval(async () => {
        score += pointsPerSecond8;
        points.innerText = score + "₹";
        updateAchievementsColor();
        
        await send("addScore", token, pointsPerSecond8);
    }, 1000);
}

// --- Modals / Popups ---
const openPopup = (): void => {
  popupOverlay.classList.remove('hidden');
};

const closePopup = (): void => {
  popupOverlay.classList.add('hidden');
};

openButton.addEventListener('click', openPopup);
closeButton.addEventListener('click', closePopup);

popupOverlay.addEventListener('click', (event: MouseEvent) => {
  if (event.target === popupOverlay) {
    closePopup();
  }
});

// --- Navigation ---
Shop.onclick = function() {
    window.location.href = 'Store.html';
};

Upgrades.onclick = function() {
    window.location.href = 'Upgrades.html';
};