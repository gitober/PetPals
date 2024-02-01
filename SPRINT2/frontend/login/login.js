document.addEventListener("DOMContentLoaded", function() {
    const loginButton = document.getElementById("loginButton");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const signUpLink = document.getElementById("signUpLink");
    const popup = document.getElementById("popup");
    const closeBtn = document.getElementById("close");

    loginButton.disabled = true;

    function checkInputs() {
        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        loginButton.disabled = !(usernameValue && passwordValue);
    }

    signUpLink.addEventListener("click", function() {
        popup.style.display = "block";
    });

    closeBtn.addEventListener("click", function() {
        popup.style.display = "none";
    });

    usernameInput.addEventListener("input", checkInputs);
    passwordInput.addEventListener("input", checkInputs);

    document.getElementById("loginForm").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
        const usernameValue = usernameInput.value.trim();
        const passwordValue = passwordInput.value.trim();

        if (usernameValue && passwordValue) {
            // Redirect to home.html
            window.location.href ="../home/home.html";
        }
    });
});
