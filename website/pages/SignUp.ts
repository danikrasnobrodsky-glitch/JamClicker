import { send } from "clientUtilities";
import { get } from "componentUtilities";

var UserNameInput = document.querySelector<HTMLInputElement>("#UserName")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#PassWord")!;
var CreateAccountButton = document.querySelector<HTMLButtonElement>("#Button1")!;
var ConfirmPasswordInput = document.querySelector<HTMLInputElement>("#ConfirmPassWord")!;
var ErrorDiv = document.querySelector<HTMLElement>("#ErrorDiv")!;

var errorTimeout: number | null = null;

CreateAccountButton.onclick = async function () {
  var username = UserNameInput.value.trim();
  var password = PasswordInput.value;
  var confirmPassword = ConfirmPasswordInput.value;

  function triggerErrorTimer(durationMs: number = 3000) {
    if (errorTimeout) {
      clearTimeout(errorTimeout);
    }

    errorTimeout = window.setTimeout(() => {
      ErrorDiv.style.display = "none";
      ErrorDiv.innerText = "";
      errorTimeout = null;
    }, durationMs);
  }
  
  if (username.length <= 3) {
    ErrorDiv.innerText = "Username is too short";
    ErrorDiv.style.display = "block";
    triggerErrorTimer();
    return;
  }

  if (username.length >= 12) {
    ErrorDiv.innerText = "Username is too long";
    ErrorDiv.style.display = "block";
    triggerErrorTimer();
    return;
  }

  if (password !== confirmPassword) {
    ErrorDiv.innerText = "Passwords do not match";
    ErrorDiv.style.display = "block";
    triggerErrorTimer();
    return;
  }

  var userToken = await send<string | null>("Signup", username, password);

  if (userToken == null) {
    ErrorDiv.innerText = "A user with that username already exists.";
    ErrorDiv.style.display = "block";
    triggerErrorTimer();
    return;
  }

  if (errorTimeout) clearTimeout(errorTimeout);
  ErrorDiv.style.display = "none";
  ErrorDiv.innerText = "";

  localStorage.setItem("userToken", userToken);
  window.location.href = 'Game.html';
};



