const express = require("express");
const { findTrips } = require("../Controllers/tripController");
const router = express.Router();
router.get("/", findTrips);
module.exports = router;
