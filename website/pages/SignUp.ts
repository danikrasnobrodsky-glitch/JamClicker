import { send } from "clientUtilities";
import { get } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#UserName")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#PassWord")!;
var ConfirmInput = document.querySelector<HTMLInputElement>("#ConfirmPassWord")!;
var CreateAccountButton = document.querySelector<HTMLButtonElement>("#Button1")!;
var ErrorDiv = document.querySelector<HTMLDivElement>("#ErrorDiv")!;


CreateAccountButton.onclick = async function() {
  await send("addLoginDetail", UserNameInput.value, PasswordInput.value);
};








CreateAccountButton.onclick = async function () {
  if (PasswordInput.value != ConfirmInput.value) {
    ErrorDiv.innerText = "Passwords do not match.";
    return;
  }

  var userToken = await send<string | null>("signUp", UserNameInput.value, PasswordInput.value);

  if (userToken == null) {
    ErrorDiv.innerText = "A user with that username already exists.";
    return;
  }

  localStorage.setItem("userToken", userToken);
  location.href = "chat.html";
};