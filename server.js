require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const authRoutes = require("./routes/authRoutes"); // new auth routes
const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// MongoDB Setup (Local by default, can use Atlas URL)
const MONGO_URI = 'mongodb://127.0.0.1:27017/youandmedb';

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => console.error("❌ MongoDB Connection Error:", err));

// Note: User model has been moved to controllers/models and auth routes

const ChatSchema = new mongoose.Schema({
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});
const Chat = mongoose.model("Chat", ChatSchema);

const SongSchema = new mongoose.Schema({
    filename: String,
    url: String,
    uploadedAt: { type: Date, default: Date.now }
});
const Song = mongoose.model("Song", SongSchema);

// Setup File Uploads for Songs
const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- API ROUTES ---

// 2) Authentication Routes
app.use("/api/auth", authRoutes);

// 3. Chat: Get Messages
app.get("/api/chat", async (req, res) => {
    try {
        const messages = await Chat.find().sort({ timestamp: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to load chats" });
    }
});

// 4. Chat: Post Message
app.post("/api/chat", async (req, res) => {
    try {
        const { sender, message } = req.body;
        if (!sender || !message) return res.status(400).json({ error: "Invalid message" });

        const newChat = new Chat({ sender, message });
        await newChat.save();
        res.json(newChat);
    } catch (err) {
        res.status(500).json({ error: "Failed to send chat" });
    }
});

// 5. Songs: Upload
app.post("/api/songs", upload.single("songFile"), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        const newSong = new Song({
            filename: req.file.originalname,
            url: `/uploads/${req.file.filename}`
        });

        await newSong.save();
        res.json(newSong);
    } catch (err) {
        res.status(500).json({ error: "Failed to upload song" });
    }
});

// 6. Songs: Get
app.get("/api/songs", async (req, res) => {
    try {
        const songs = await Song.find().sort({ uploadedAt: -1 });
        res.json(songs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch songs" });
    }
});

// Serve Frontend properly
app.get(/(.*)/, (req, res) => {
    // Basic routing to correctly serve html matching the routes
    if (req.path === '/signup.html') {
        res.sendFile(path.join(__dirname, "signup.html"));
    } else if (req.path === '/dashboard.html') {
        res.sendFile(path.join(__dirname, "dashboard.html"));
    } else {
        res.sendFile(path.join(__dirname, "index.html")); // default login page
    }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
