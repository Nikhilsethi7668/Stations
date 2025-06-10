const express = require("express");
const { getAllStations } = require("../Controllers/stationcontroller");
const router = express.Router();

router.get("/", getAllStations);
module.exports = router;
