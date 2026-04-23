var sButton = document.querySelector<HTMLInputElement>("#subB")!;
var aButton = document.querySelector<HTMLButtonElement>("#addB")!;
var myDiv = document.querySelector<HTMLDivElement>("#Div")!;


sButton.onclick = function () {
    myDiv.innerText = String(parseInt(myDiv.innerText)-1);
}


aButton.onclick = function () {
    myDiv.innerText = String(parseInt(myDiv.innerText)+1);
}
