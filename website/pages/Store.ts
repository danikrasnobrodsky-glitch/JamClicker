import { send } from "clientUtilities";
import { get } from "componentUtilities";

var buy5 = get("div", "buy5");
var itemName = get("div", "item-name");
var token = localStorage.getItem("userToken");
var cursors = await send<number | null>("getScore", token);
var cursorDiv = document.getElementById("item-name");

let CursorItem: number = 0;

async function loadCursor() {
    if (!cursorDiv) {
        return;
    }

    cursorDiv.textContent =
        cursors != null ? String(cursors) : "No score available";
}

loadCursor();

buy5.addEventListener('click', (): void => {
    void updateCursor(1);
    
});
async function updateCursor(add: number) {
    if (!token) {
        console.error("User is not authenticated.");
        return;
    }

    CursorItem += add;
    itemName.innerText = "Jams: " + CursorItem;
    await send("addCursorItem", token, add);
}

var lastLoginCursor = await send<number>("getCursorItem", token);

CursorItem = lastLoginCursor;
itemName.innerText = "Jams: " + CursorItem;