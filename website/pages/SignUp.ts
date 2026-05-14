import { send } from "clientUtilities";
import { get } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#UserName")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#PassWord")!;
var CreateAccountButton = document.querySelector<HTMLButtonElement>("#Button1")!;
var ConfirmPasswordInput = document.querySelector<HTMLInputElement>("#ConfirmPassWord")!;
var ErrorDiv = document.querySelector<HTMLElement>("#ErrorDiv")!;

CreateAccountButton.onclick = async function () {
  var username = UserNameInput.value;
  var password = PasswordInput.value;
  var confirmPassword = ConfirmPasswordInput.value;
  



  if (username.length <= 3) {
    ErrorDiv.innerText = "Username is too short.";
    return;
  }

  if (username.length >= 12) {
    ErrorDiv.innerText = "Username is too long.";
    return;
  }

  if (password != confirmPassword) {
    ErrorDiv.innerText = "Passwords do not match.";
    return;
  }

  var userToken = await send<string | null>("Signup", username, password);

  if (userToken == null) {
    ErrorDiv.innerText = "A user with that username already exists.";
    return;
  }

  ErrorDiv.innerText = "";

  localStorage.setItem("userToken", userToken);

  window.location.href = 'Game.html';
};







