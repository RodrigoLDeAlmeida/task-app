const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,      // remove espaços extras
    lowercase: true, // armazena sempre em minúsculas
  },
  password: {
    type: String,
    required: true,
  },
}, { timestamps: true }); // adiciona createdAt e updatedAt automaticamente

module.exports = mongoose.model("User", userSchema);
