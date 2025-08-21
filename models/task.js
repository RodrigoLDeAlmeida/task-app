const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  summary: {
    type: String,
    required: true,
    trim: true, // remove espaços extras
    maxlength: 100 // limite para manter coerente com validação
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

module.exports = mongoose.model("Task", taskSchema);
