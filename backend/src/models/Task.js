const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: String,   // ✅ FIXED
      required: true
    },

    title: {
      type: String,
      required: true
    },

    priority: {
      type: String,
      default: "medium"
    },

    category: {
      type: String,
      default: "General"
    },

    completed: {
      type: Boolean,
      default: false
    },

    dueDate: {
      type: Date
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);