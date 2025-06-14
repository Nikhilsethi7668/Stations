const Trip = require("../Models/Trip");
const StopTime = require("../Models/StopTime");
const Route = require("../Models/Route");
const CalendarDate = require("../Models/CalendarDate");
const { log } = require("console");

exports.findTrips = async (req, res) => {
  try {
    const { from_stop_id, to_stop_id, date } = req.body;
    console.log("Request body:", from_stop_id," ", to_stop_id," ", date);

    const services = await CalendarDate.find({
      date,
      exception_type: 1,
    }).distinct("service_id");

    console.log("Services for the date:", services);

    const originStopTimes = await StopTime.find({ stop_id: from_stop_id });
     console.log("Origin stop times:", originStopTimes[0]);
    const trips = [];
    // console.log(typeof to_stop_id);
    // console.log(typeof to_stop_id.toString())
    for (const originStop of originStopTimes) {

      const destinationStop = await StopTime.findOne({
        trip_id: originStop.trip_id,
        stop_id: to_stop_id,
        stop_sequence: { $gt: originStop.stop_sequence },
      });
      if(destinationStop) {
        console.log("Found destination stop:", destinationStop);
      }

      if (!destinationStop) continue;

      const trip = await Trip.findOne({
        trip_id: originStop.trip_id,
        service_id: { $in: services },
      });

      if (!trip) continue;

      const route = await Route.findOne({ route_id: trip.route_id });
      if (!route) continue;

      const allStops = await StopTime.find({
        trip_id: originStop.trip_id,
        stop_sequence: { $gte: originStop.stop_sequence },
      }).sort({ stop_sequence: 1 });

      console.log("All stops for trip:", allStops);

      trips.push({
        trip_id: originStop.trip_id,
        departure_time: originStop.departure_time,
        arrival_time: destinationStop.arrival_time,
        route_name: route.route_long_name,
        stops: allStops,
      });
    }
    console.log("Found trips:", trips);
    res.json(trips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
