const mongoose = require("mongoose");

module.exports = async function connectDB(uri) {
  if (!uri) throw new Error("MONGO_URI is missing");
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  return mongoose.connection;
};