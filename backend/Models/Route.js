const mongoose = require("mongoose");
const routeSchema = new mongoose.Schema({
  route_id: { type: String, unique: true, index: true, required: true },
  route_long_name: { type: String, required: true },
  route_type: { type: Number, required: true },
  route_color: { type: String },
  route_text_color: { type: String },
});
module.exports = mongoose.models.Route || mongoose.model("Route", routeSchema);
