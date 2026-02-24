// login.js

// CHECK LOGIN
// If already logged in, go to dashboard
if (localStorage.getItem("user")) {
    window.location = "dashboard.html";
}

async function loginUser() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let errorMsg = document.getElementById("error");

    if (!email || !password) {
        errorMsg.innerText = "Please fill all fields ❌";
        errorMsg.style.color = "red";
        return;
    }

    try {
        let res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        let data = await res.json();

        if (res.ok) {
            localStorage.setItem("user", data.user.email);
            window.location = "dashboard.html";
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
