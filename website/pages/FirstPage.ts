import { get } from "componentUtilities";

var play = get("button", "Play");
var credits = get("button", "Credits");


play.onclick = function() {
    window.location.href = 'SignUp.html';
};