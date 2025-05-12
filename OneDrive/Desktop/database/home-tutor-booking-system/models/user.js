const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /[a-zA-Z0-9_\.\-]+[@][a-z]{1,}[\.][a-z]{1,}/
  },
  role: {
    type: String,
    enum: ["student", "tutor"],
    required: true
  }
});

module.exports = mongoose.model("User", userSchema);
