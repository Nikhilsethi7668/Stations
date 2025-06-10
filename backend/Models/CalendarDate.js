const mongoose = require("mongoose");
const calendarDateSchema = new mongoose.Schema({
  service_id: { type: String, index: true, required: true },
  date: { type: String, index: true, required: true },
  exception_type: { type: Number, required: true },
});
calendarDateSchema.index({ date: 1, service_id: 1 });
module.exports =
  mongoose.models.CalendarDate ||
  mongoose.model("CalendarDate", calendarDateSchema);
