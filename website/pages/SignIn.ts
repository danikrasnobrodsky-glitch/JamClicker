import { send } from "clientUtilities";

var UsernameInput = document.querySelector<HTMLInputElement>("#UserName")!;
var PasswordInput = document.querySelector<HTMLInputElement>("#PassWord")!;
var LoginSubmitButton = document.querySelector<HTMLButtonElement>("#Button1")!;
var ErrorMessage = document.querySelector<HTMLParagraphElement>("#ErrorMessage")!;
const toggleBtn = document.getElementById("togglePassword") as HTMLButtonElement;

var errorTimeout: number | null = null;


function triggerErrorTimer(durationMs: number = 3000) {
  if (errorTimeout) {
    clearTimeout(errorTimeout);
  }

  errorTimeout = window.setTimeout(() => {
    ErrorMessage.style.display = "none";
    ErrorMessage.innerText = "";
    errorTimeout = null;
  }, durationMs);
}

LoginSubmitButton.onclick = async function () {
  var username = UsernameInput.value;
  var password = PasswordInput.value;

  var userToken = await send<string | null>("Login", username, password);


  if (userToken != null) {
    console.log("hello");
    if (errorTimeout) clearTimeout(errorTimeout);
    ErrorMessage.style.display = "none";
    ErrorMessage.innerText = "";

    console.log("hello");
    localStorage.setItem("userToken", userToken);
    location.href = "/website/pages/Game.html";
  } else {
    ErrorMessage.innerText = "Username or password is incorrect";
    ErrorMessage.style.display = "block";
    triggerErrorTimer();
  }
};

toggleBtn.addEventListener("click", () => {
    if (PasswordInput.type == "password") {
        PasswordInput.type = "text";
        toggleBtn.textContent = "ㅤ";
    } else {
        PasswordInput.type = "password";
        toggleBtn.textContent = "╱";
    }
});