document.addEventListener("DOMContentLoaded", () => {
  const toggleLink = document.getElementById("toggle-link");
  const toggleText = document.getElementById("toggle-text");
  const formTitle = document.getElementById("form-title");
  const nameField = document.getElementById("name-field");
  const confirmField = document.getElementById("confirm-field");
  const authForm = document.getElementById("auth-form");
  const errorMsg = document.getElementById("error-msg");
  const submitBtn = document.getElementById("submit-btn");

  let isLogin = true;

  toggleLink.addEventListener("click", (e) => {
    e.preventDefault();
    isLogin = !isLogin;

    if (isLogin) {
      formTitle.textContent = "Login";
      toggleText.textContent = "Don't have an account?";
      toggleLink.textContent = "Sign Up";
      submitBtn.textContent = "Login";
      authForm.action = "login.php";
      nameField.classList.add("d-none");
      confirmField.classList.add("d-none");
    } else {
      formTitle.textContent = "Sign Up";
      toggleText.textContent = "Already have an account?";
      toggleLink.textContent = "Login";
      submitBtn.textContent = "Sign Up";
      authForm.action = "signup.php";
      nameField.classList.remove("d-none");
      confirmField.classList.remove("d-none");
    }

    errorMsg.textContent = "";
  });

  authForm.addEventListener("submit", (e) => {
    errorMsg.textContent = "";
    if (!isLogin) {
      const pass = authForm.password.value;
      const confirm = authForm.confirm_password.value;
      if (pass !== confirm) {
        e.preventDefault();
        errorMsg.textContent = "Passwords do not match.";
      }
    }
  });
});
