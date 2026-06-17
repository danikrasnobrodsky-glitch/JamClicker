import { send } from "clientUtilities";
import { get } from "componentUtilities";

var play = get("button", "Play");
var credits = get("button", "Credits");


play.onclick = function() {
    window.location.href = 'SignUp.html';
};

credits.onclick = function() {
    window.location.href = 'Credits.html';
};