const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortCode: String,
    originalUrl: String,
  },
  { timestamps: true } // 👈 this adds createdAt & updatedAt automatically
);

module.exports = mongoose.model("Url", urlSchema);
