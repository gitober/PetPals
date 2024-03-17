// document.addEventListener("DOMContentLoaded", function() {
//     const loginButton = document.getElementById("loginButton");
//     const usernameInput = document.getElementById("username");
//     const passwordInput = document.getElementById("password");
//     const signUpCloseLink = document.getElementById("signUpCloseLink");
//     const signUpLink = document.getElementById("signUpLink");
//     const popup = document.getElementById("popup");
//     const popupClose = document.getElementById("popupClose");
//     const closeBtn = document.getElementById("close");
//     const closePopBtn = document.getElementById("closePop");


//     loginButton.disabled = true;

//     function checkInputs() {
//         const usernameValue = usernameInput.value.trim();
//         const passwordValue = passwordInput.value.trim();

//         loginButton.disabled = !(usernameValue && passwordValue);
//     }

//     signUpLink.addEventListener("click", function() {
//         popup.style.display = "block";
//     });

//     signUpCloseLink.addEventListener("click", function() {
//         popupClose.style.display = "block";
//     });

//     closeBtn.addEventListener("click", function() {
//         popup.style.display = "none";
//     });

//     closePopBtn.addEventListener("click", function() {
//         popupClose.style.display = "none";
//     });

//     usernameInput.addEventListener("input", checkInputs);
//     passwordInput.addEventListener("input", checkInputs);

//     document.getElementById("loginForm").addEventListener("submit", function(event) {
//         event.preventDefault(); // Prevent form submission
//         const usernameValue = usernameInput.value.trim();
//         const passwordValue = passwordInput.value.trim();

//         if (usernameValue && passwordValue) {
//             // Redirect to home.html
//             window.location.href ="../home/home.html";
//         }
//     });
// });

