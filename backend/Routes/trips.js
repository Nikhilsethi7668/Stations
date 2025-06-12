const express = require("express");
const { findTrips } = require("../Controllers/tripController");
const router = express.Router();
router.post("/", findTrips);
module.exports = router;
