// signup.js

// CHECK LOGIN
// If already logged in, go to dashboard
if (localStorage.getItem("user")) {
    window.location = "dashboard.html";
}

async function registerUser() {
    let name = document.getElementById("name") ? document.getElementById("name").value : "Test User"; // Fallback if name input doesn't exist yet
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorMsg = document.getElementById("error");

    if (!email || !password || !name) {
        errorMsg.innerText = "Please fill all fields ❌";
        errorMsg.style.color = "red";
        return;
    }

    try {
        let res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        let data = await res.json();

        if (res.ok) {
            errorMsg.innerText = "Sign up successful! You can now login ✅";
            errorMsg.style.color = "#00ffcc";

            // clear fields
            if (document.getElementById("name")) document.getElementById("name").value = "";
            document.getElementById("email").value = "";
            document.getElementById("password").value = "";
        } else {
            errorMsg.innerText = data.error + " ❌";
            errorMsg.style.color = "red";
        }
    } catch (err) {
        console.error(err);
        errorMsg.innerText = "Server Error. Is the backend running? ❌";
        errorMsg.style.color = "red";
    }
}
