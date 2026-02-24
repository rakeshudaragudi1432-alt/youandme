
// CHECK LOGIN
function checkLogin() {
  if (!localStorage.getItem("user")) {
    window.location = "index.html";
  }
}

// LOGOUT
function logout() {
  localStorage.removeItem("user");
  window.location = "index.html";
}

// TABS
function showTab(id) {
  document.querySelectorAll(".tab").forEach(t => t.style.display = "none");
  document.getElementById(id).style.display = "block";
}

// 💬 CHAT
async function sendMsg() {
  let msg = document.getElementById("msg").value;
  let user = localStorage.getItem("user");

  if (!msg) return;

  try {
    await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sender: user, message: msg })
    });

    document.getElementById("msg").value = "";
    displayMsg();
  } catch (err) {
    console.error("Error sending message:", err);
  }
}

async function displayMsg() {

  let chatBoxElem = document.getElementById("chatBox");
  if (!chatBoxElem) return;

  let currentUser = localStorage.getItem("user");

  try {
    let res = await fetch("/api/chat");
    let chat = await res.json();

    chatBoxElem.innerHTML = "";

    chat.forEach(c => {

      let div = document.createElement("div");

      div.classList.add("msg");

      if (c.sender === currentUser) {
        div.classList.add("me");
        div.innerText = c.message;
      } else {
        div.classList.add("other");
        div.innerText = c.message;
      }

      chatBoxElem.appendChild(div);
    });

    chatBoxElem.scrollTop = chatBoxElem.scrollHeight;

  } catch (err) {
    console.error("Error loading messages:", err);
  }
}
setInterval(displayMsg, 2000);

// 🎵 SONGS
async function uploadSong() {
  let fileInput = document.getElementById("songUpload");
  if (!fileInput.files.length) return;

  let formData = new FormData();
  formData.append("songFile", fileInput.files[0]);

  try {
    await fetch("/api/songs", {
      method: "POST",
      body: formData
    });

    fileInput.value = "";
    loadSongs();
  } catch (err) {
    console.error("Error uploading song:", err);
  }
}

async function loadSongs() {
  let songListElem = document.getElementById("songList");
  if (!songListElem) return;

  try {
    let res = await fetch("/api/songs");
    let songs = await res.json();

    songListElem.innerHTML = "";
    songs.forEach(s => {
      songListElem.innerHTML += `<li>${s.filename} <br><audio controls src="${s.url}"></audio></li>`;
    });
  } catch (err) {
    console.error("Error loading songs:", err);
  }
}

loadSongs();
document.getElementById("msg").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMsg();
  }
});