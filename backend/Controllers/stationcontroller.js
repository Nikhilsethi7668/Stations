const Stop = require("../Models/Stop");

exports.getAllStations = async (req, res) => {
  try {
    const stations = await Stop.find({}).select("stop_id stop_name");
    res
      .status(200)
      .json(stations.map((s) => ({ id: s.stop_id, name: s.stop_name })));
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch stations" });
  }
};
