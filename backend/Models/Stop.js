const mongoose = require("mongoose");
const stopSchema = new mongoose.Schema({
  stop_id: { type: String, unique: true, index: true, required: true },
  stop_code: { type: String },
  stop_name: { type: String, required: true },
  stop_lat: { type: Number, required: true },
  stop_lon: { type: Number, required: true },
});
module.exports = mongoose.models.Stop || mongoose.model("Stop", stopSchema);
