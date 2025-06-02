const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { connectDB } = require("./Database/db");
const cors = require("cors");

dotenv.config();

app.use(bodyParser.json());

connectDB();

app.use(cors());
app.listen(process.env.PORT, () => {
  console.log(`Proces is running on ${process.env.PORT}`);
});
