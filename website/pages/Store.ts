import { send } from "clientUtilities";
import { get } from "componentUtilities";


var token = localStorage.getItem("userToken");
var points = await send<number | null>("getScore", token);

var pointsDiv = document.getElementById("points");

// if (points !== null && points !== undefined) {
    
//     pointsDiv.textContent = String(points);
// } else {
//     pointsDiv.textContent = "No score available";
// }