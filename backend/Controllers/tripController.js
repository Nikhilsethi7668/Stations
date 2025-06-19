const Trip = require("../Models/Trip");
const StopTime = require("../Models/StopTime");
const Route = require("../Models/Route");
const CalendarDate = require("../Models/CalendarDate");

exports.findTrips = async (req, res) => {
  try {
    const { from_stop_id, to_stop_id, date } = req.body;
    console.log("Request received:", { from_stop_id, to_stop_id, date });

    const services = await CalendarDate.find({
      date,
      exception_type: 1,
    }).distinct("service_id");
    console.log("Active service_ids:", services);

    const paths = await findPaths(from_stop_id, to_stop_id, services);
    console.log("Total paths found:", paths.length);

    res.json(paths);
  } catch (error) {
    console.error("Error in findTrips controller:", error);
    res.status(500).json({ error: error.message });
  }
};

async function findPaths(from_stop_id, to_stop_id, services) {
  const paths = [];

  const directTrips = await findDirectTrips(from_stop_id, to_stop_id, services);
  console.log("Direct trips found:", directTrips.length);
  paths.push(...directTrips);

  const oneTransferTrips = await findTripsWithOneTransfer(
    from_stop_id,
    to_stop_id,
    services
  );
  console.log("One-transfer trips found:", oneTransferTrips.length);
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
  console.log("Finding one-transfer trips...");

  const originLegs = await StopTime.aggregate([
    { $match: { stop_id: from_stop_id } },
    {
      $lookup: {
        from: "stoptimes",
        let: { trip: "$trip_id", seq: "$stop_sequence" },
        pipeline: [
          { $match: { $expr: { $eq: ["$trip_id", "$$trip"] } } },
          { $match: { $expr: { $gt: ["$stop_sequence", "$$seq"] } } },
          {
            $project: {
              stop_id: 1,
              stop_sequence: 1,
              departure_time: 1,
              arrival_time: 1,
            },
          },
        ],
        as: "nextStops",
      },
    },
    { $unwind: "$nextStops" },
    {
      $project: {
        trip_id: "$trip_id",
        stop_id: "$nextStops.stop_id",
        arrive: "$nextStops.arrival_time",
        depart: "$nextStops.departure_time",
      },
    },
  ]);

  const destLegs = await StopTime.aggregate([
    { $match: { stop_id: to_stop_id } },
    {
      $lookup: {
        from: "stoptimes",
        let: { trip: "$trip_id", seq: "$stop_sequence" },
        pipeline: [
          { $match: { $expr: { $eq: ["$trip_id", "$$trip"] } } },
          { $match: { $expr: { $lt: ["$stop_sequence", "$$seq"] } } },
          {
            $project: {
              stop_id: 1,
              stop_sequence: 1,
              departure_time: 1,
              arrival_time: 1,
            },
          },
        ],
        as: "prevStops",
      },
    },
    { $unwind: "$prevStops" },
    {
      $project: {
        trip_id: "$trip_id",
        stop_id: "$prevStops.stop_id",
        arrive: "$prevStops.arrival_time",
        depart: "$prevStops.departure_time",
      },
    },
  ]);

  const legsByStop = new Map();
  for (const leg of destLegs) {
    if (!legsByStop.has(leg.stop_id)) legsByStop.set(leg.stop_id, []);
    legsByStop.get(leg.stop_id).push(leg);
  }

  const transfers = [];
  for (const leg1 of originLegs) {
    const candidates = legsByStop.get(leg1.stop_id);
    if (!candidates) continue;

    for (const leg2 of candidates) {
      const time1 = new Date(`2000-01-01T${leg1.arrive}`);
      const time2 = new Date(`2000-01-01T${leg2.depart}`);
      const transferTime = (time2 - time1) / (1000 * 60);

      if (transferTime >= 5) {
        transfers.push({
          type: "transfer",
          transfer_stop: leg1.stop_id,
          first_leg: {
            trip: leg1.trip_id,
            depart: leg1.depart,
            arrive: leg1.arrive,
          },
          second_leg: {
            trip: leg2.trip_id,
            depart: leg2.depart,
            arrive: leg2.arrive,
          },
          total_departure_time: leg1.depart,
          total_arrival_time: leg2.arrive,
        });
      }
    }
  }

  console.log("Total transfer trips:", transfers.length);
  return transfers;
}
