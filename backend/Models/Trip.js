const mongoose = require("mongoose");
const tripSchema = new mongoose.Schema({
  trip_id: { type: String, unique: true, index: true, required: true },
  route_id: { type: String, index: true, required: true },
  service_id: { type: String, index: true, required: true },
  trip_headsign: String,
  trip_short_name: String,
  direction_id: Number,
  shape_id: String,
  peak_offpeak: Number,
});
module.exports = mongoose.model("Trip", tripSchema);
