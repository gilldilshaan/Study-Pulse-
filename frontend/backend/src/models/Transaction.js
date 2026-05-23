const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  type: String,
  category: String,
  amount: Number,
  date: String,
  userId: String
});

module.exports = mongoose.model("Transaction", transactionSchema);