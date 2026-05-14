import { send } from "clientUtilities";

var UsernameInput = document.querySelector<HTMLInputElement>("#UserName")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#PassWord")!;
var LoginSubmitButton = document.querySelector<HTMLButtonElement>("#Button1")!;
var ErrorMessage = document.querySelector<HTMLParagraphElement>("#ErrorMessage")!;

LoginSubmitButton.onclick = async function() {
  var username = UsernameInput.value;
  var password = PasswordInput.value;

  var userToken = await send<string | null>("Login", username, password);

  if (userToken != null) {
    ErrorMessage.style.visibility = "hidden";
    localStorage.setItem("userToken", userToken);

    location.href = "/website/pages/Game.html";
  } else {
    ErrorMessage.innerText = "Username or password is incorrect";
    ErrorMessage.style.visibility = "visible";
  }
};