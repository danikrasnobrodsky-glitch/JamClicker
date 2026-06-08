import { send } from "clientUtilities";
import { get } from "componentUtilities";

var backButton = get("div", "backButton");

if (backButton) {
    backButton.onclick = function() {
        window.location.href = 'Game.html';
    };
}