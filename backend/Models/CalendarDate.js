const mongoose = require("mongoose");
const stopTimeSchema = new mongoose.Schema({
  trip_id: { type: String, index: true, required: true },
  arrival_time: { type: String, required: true },
  departure_time: { type: String, required: true },
  stop_id: { type: String, index: true, required: true },
  stop_sequence: { type: Number, required: true },
  pickup_type: { type: Number, default: 0 },
  drop_off_type: { type: Number, default: 0 },
});
stopTimeSchema.index({ trip_id: 1, stop_sequence: 1 });
module.exports = mongoose.model("StopTime", stopTimeSchema);
