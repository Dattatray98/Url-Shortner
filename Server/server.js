const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");
const Url = require("./Models/url");

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST"],
}));
app.use(express.json());

const PORT = process.env.PORT || 8000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Database connected"))
  .catch((err) => console.log(err));

// Routes
app.get("/", (req, res) => {
  res.send("🚀 Backend is running");
});

// Create Short URL
app.post("/shorten", async (req, res) => {
  try {
    const { originalUrl } = req.body;
    if (!originalUrl) {
      return res.status(400).json({ error: "originalUrl is required" });
    }

    const shortCode = nanoid(6);
    const newUrl = new Url({ shortCode, originalUrl });
    await newUrl.save();

    res.json({ shortUrl: `http://localhost:${PORT}/${shortCode}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// ✅ Recent 10 URLs
app.get("/recent", async (req, res) => {
  try {
    const recentUrls = await Url.find()
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(recentUrls);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


// Redirect
app.get("/:shortCode", async (req, res) => {
  const { shortCode } = req.params;
  const found = await Url.findOne({ shortCode });

  if (found) {
    res.redirect(found.originalUrl);
  } else {
    res.status(404).send("❌ Not Found");
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server started at http://localhost:${PORT}`);
});
