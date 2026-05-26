import { get } from "componentUtilities";

var BigJam = get("div", "jamDiv");
var points = get("div", "points");
var sound = get("audio", "click-sound") as HTMLAudioElement; // Fixed tag and typecast

var score = 0;

BigJam.addEventListener('click', () => {
    // Reset audio to the beginning
    sound.currentTime = 0;
    // Play the sound
    sound.play();
});


BigJam.onclick = function () {
    score++;
    points.innerText = "Score: " + score;
}


