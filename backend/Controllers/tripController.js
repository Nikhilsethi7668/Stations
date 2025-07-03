const Trip = require("../Models/Trip");
const StopTime = require("../Models/StopTime");
const Route = require("../Models/Route");
const CalendarDate = require("../Models/CalendarDate");

exports.findTrips = async (req, res) => {
  try {
    const { from_stop_id, to_stop_id, date } = req.body;
    console.log("🚀 Request received:", { from_stop_id, to_stop_id, date });

    const serviceDate =
      typeof date === "number" ? date : parseInt(date.replace(/-/g, ""));
    const services = await CalendarDate.find({
      date: serviceDate.toString(),
      exception_type: 1,
    }).distinct("service_id");

    console.log("📆 Active service_ids:", services);

    const paths = await findPaths(
      from_stop_id.toString(),
      to_stop_id.toString(),
      services
    );
    console.log("🎯 Total paths found:", paths.length);

    res.json(paths);
  } catch (error) {
    console.error("❌ Error in findTrips:", error);
    res.status(500).json({ error: error.message });
  }
};

async function findPaths(from_stop_id, to_stop_id, services) {
  const paths = [];

  const directTrips = await findDirectTrips(from_stop_id, to_stop_id, services);
  console.log("🚂 Direct trips found:", directTrips.length);
  paths.push(...directTrips);

  console.log("🔄 Finding one-transfer trips...");
  const oneTransferTrips = await findTripsWithOneTransfer(
    from_stop_id,
    to_stop_id,
    services
  );
  console.log("✅ One-transfer trips found:", oneTransferTrips.length);

  paths.push(...oneTransferTrips);
  return paths;
}

async function findDirectTrips(from_stop_id, to_stop_id, services) {
  const originStopTimes = await StopTime.find({ stop_id: from_stop_id }).lean();
  const directTrips = [];

  for (const originStop of originStopTimes) {
    const destinationStop = await StopTime.findOne({
      trip_id: originStop.trip_id,
      stop_id: to_stop_id,
      stop_sequence: { $gt: originStop.stop_sequence },
    }).lean();

    if (!destinationStop) continue;

    const trip = await Trip.findOne({
      trip_id: originStop.trip_id,
      service_id: { $in: services },
    }).lean();

    if (!trip) continue;

    const route = await Route.findOne({ route_id: trip.route_id }).lean();
    if (!route) continue;

    const allStops = await StopTime.find({
      trip_id: originStop.trip_id,
      stop_sequence: { $gte: originStop.stop_sequence },
    })
      .sort({ stop_sequence: 1 })
      .lean();

    directTrips.push({
      type: "direct",
      trip_id: originStop.trip_id,
      departure_time: originStop.departure_time,
      arrival_time: destinationStop.arrival_time,
      route_name: route.route_long_name,
      stops: allStops,
    });
  }

  return directTrips;
}

async function findTripsWithOneTransfer(from_stop_id, to_stop_id, services) {
  const transferTrips = [];

  // First: all trips FROM from_stop_id
  const originStopTimes = await StopTime.find({ stop_id: from_stop_id }).lean();

  for (const origin of originStopTimes) {
    const firstTrip = await Trip.findOne({
      trip_id: origin.trip_id,
      service_id: { $in: services },
    }).lean();

    if (!firstTrip) continue;

    const afterStops = await StopTime.find({
      trip_id: origin.trip_id,
      stop_sequence: { $gt: origin.stop_sequence },
    }).lean();

    for (const interStop of afterStops) {
      const interStopId = interStop.stop_id;

      // Now, second leg: to destination
      const secondTripStopTimes = await StopTime.find({
        stop_id: interStopId,
      }).lean();

      for (const secondStop of secondTripStopTimes) {
        const destStop = await StopTime.findOne({
          trip_id: secondStop.trip_id,
          stop_id: to_stop_id,
          stop_sequence: { $gt: secondStop.stop_sequence },
        }).lean();

        if (!destStop) continue;

        const secondTrip = await Trip.findOne({
          trip_id: secondStop.trip_id,
          service_id: { $in: services },
        }).lean();

        if (!secondTrip) continue;

        // Check time gap (at least 5 minutes)
        const firstArrival = new Date(`2000-01-01T${interStop.arrival_time}`);
        const secondDeparture = new Date(
          `2000-01-01T${secondStop.departure_time}`
        );
        const diffMins = (secondDeparture - firstArrival) / 60000;

        if (diffMins < 5 || diffMins > 90) continue;

        const route1 = await Route.findOne({
          route_id: firstTrip.route_id,
        }).lean();
        const route2 = await Route.findOne({
          route_id: secondTrip.route_id,
        }).lean();

        const firstLegStops = await StopTime.find({
          trip_id: origin.trip_id,
          stop_sequence: {
            $gte: origin.stop_sequence,
            $lte: interStop.stop_sequence,
          },
        })
          .sort({ stop_sequence: 1 })
          .lean();

        const secondLegStops = await StopTime.find({
          trip_id: secondStop.trip_id,
          stop_sequence: {
            $gte: secondStop.stop_sequence,
            $lte: destStop.stop_sequence,
          },
        })
          .sort({ stop_sequence: 1 })
          .lean();

        transferTrips.push({
          type: "transfer",
          transfer_stop: interStopId,
          total_departure_time: origin.departure_time,
          total_arrival_time: destStop.arrival_time,
          first_leg: {
            trip_id: origin.trip_id,
            route_name: route1?.route_long_name || "",
            departure_time: origin.departure_time,
            arrival_time: interStop.arrival_time,
            stops: firstLegStops,
          },
          second_leg: {
            trip_id: secondStop.trip_id,
            route_name: route2?.route_long_name || "",
            departure_time: secondStop.departure_time,
            arrival_time: destStop.arrival_time,
            stops: secondLegStops,
          },
        });
      }
    }
  }

  return transferTrips;
}
