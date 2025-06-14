const Stop = require("../Models/Stop");
const CalendarDate = require("../Models/CalendarDate");
exports.getAllStations = async (req, res) => {
  try {
    const stations = await Stop.find({}).select("stop_id stop_name");
    const dates = await CalendarDate.find({}).select("date");
    res
      .status(200)
      .json(
        stations.map((s) => ({
          id: s.stop_id,
          name: s.stop_name,
          dates: dates,
        }))
      );
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
};
