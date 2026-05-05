const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      default: "General"
    },

    dueDate: {
      type: Date
    },

    status: {
      type: String,
      enum: ["not-started", "in-progress", "done"],
      default: "not-started"
    },

    progress: {
      type: Number,
      default: 0
    },

    /* 🔥 FIX HERE */
    userId: {
      type: String,   // ✅ CHANGED FROM ObjectId → String
      required: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Assignment", assignmentSchema);