const Trip = require("../Models/Trip");
const StopTime = require("../Models/StopTime");
const Route = require("../Models/Route");
const CalendarDate = require("../Models/CalendarDate");

exports.findTrips = async (req, res) => {
  try {
    const { from_stop_id, to_stop_id, date } = req.body;

    const services = await CalendarDate.find({
      date,
      exception_type: 1,
    }).distinct("service_id");

    const paths = await findPaths(from_stop_id, to_stop_id, services);

    res.json(paths);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function findPaths(from_stop_id, to_stop_id, services) {
  const paths = [];

  const directTrips = await findDirectTrips(from_stop_id, to_stop_id, services);
  paths.push(...directTrips);

  const oneTransferTrips = await findTripsWithOneTransfer(
    from_stop_id,
    to_stop_id,
    services
  );
  paths.push(...oneTransferTrips);

  return paths;
}

async function findDirectTrips(from_stop_id, to_stop_id, services) {
  const originStopTimes = await StopTime.find({ stop_id: from_stop_id });
  const directTrips = [];

  for (const originStop of originStopTimes) {
    const destinationStop = await StopTime.findOne({
      trip_id: originStop.trip_id,
      stop_id: to_stop_id,
      stop_sequence: { $gt: originStop.stop_sequence },
    });

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

  const intermediateStops = await StopTime.find({
    stop_id: { $ne: from_stop_id, $ne: to_stop_id },
  }).distinct("stop_id");

  for (const intermediateStop of intermediateStops) {
    const firstLegTrips = await findDirectTrips(
      from_stop_id,
      intermediateStop,
      services
    );

    for (const firstLeg of firstLegTrips) {
      const secondLegTrips = await findDirectTrips(
        intermediateStop,
        to_stop_id,
        services
      );

      for (const secondLeg of secondLegTrips) {
        const firstLegArrival = new Date(`2000-01-01T${firstLeg.arrival_time}`);
        const secondLegDeparture = new Date(
          `2000-01-01T${secondLeg.departure_time}`
        );
        const transferTime =
          (secondLegDeparture - firstLegArrival) / (1000 * 60);

        if (transferTime >= 5) {
          transferTrips.push({
            type: "transfer",
            first_leg: firstLeg,
            second_leg: secondLeg,
            transfer_stop: intermediateStop,
            total_departure_time: firstLeg.departure_time,
            total_arrival_time: secondLeg.arrival_time,
          });
        }
      }
    }
  }

  return transferTrips;
}
