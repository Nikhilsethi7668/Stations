const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { connectDB } = require("./Database/db");
const cors = require("cors");
const stationRoute = require("./Routes/stations");
const tripRouter = require("./Routes/trips");

dotenv.config();

app.use(bodyParser.json());

connectDB();

app.use(cors());
app.listen(process.env.PORT, () => {
  console.log(`Proces is running on ${process.env.PORT}`);
});
app.use("/api/station", stationRoute);
app.use("/api/trip", tripRouter);
