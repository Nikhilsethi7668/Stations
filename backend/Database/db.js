const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log("Database conection setup successfully");
    })
    .catch((err) => {
      console.log("Database conection failed");
      console.log(err);
    });
};
module.exports = { connectDB };
