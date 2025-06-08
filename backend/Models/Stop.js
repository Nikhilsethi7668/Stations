const mongoose = require("mongoose");
const StopSchema = new mongoose.Schema({
  stopId: {
    type: String,
    unique: true,
    index: true,
    required: true,
  },
  stopCode: {
    typr: String,
  },
  stopName: {
    type: String,
    required: True,
  },
  stopLat: {
    type: String,
    required: True,
  },
  stopLon: {
    type: String,
    required: True,
  },
});
module.exports = mongoose.model("Stop", StopSchema);
