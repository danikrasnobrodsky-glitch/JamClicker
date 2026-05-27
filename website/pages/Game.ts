import { send } from "clientUtilities";
import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");
var sound = get("audio", "click-sound");

var score = 0;
var token = localStorage.getItem("userToken");

BigJam.addEventListener('click', () => {
    sound.currentTime = 0; 
    sound.play(); 

    score++;
    points.innerText = "Jams: " + score;
});


async function UpdateScore(add: number) {
    
    score += add;
    points.innerText = "Jams: " + score;
    send("addScore", token, add);
}