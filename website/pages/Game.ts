import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");

var score = 0;

BigJam.onclick = function () {
    score++;
    points.innerText = "Score: " + score;
}