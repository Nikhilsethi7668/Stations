const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

// Load models
const Stop = require("../models/Stop");
const Route = require("../models/Route");
const Trip = require("../models/Trip");
const StopTime = require("../models/StopTime");
const CalendarDate = require("../models/CalendarDate");

const GTFS_FOLDER = path.join(__dirname, "..", "..", "gtfs");

function loadCSV(filename, callback) {
  const results = [];
  fs.createReadStream(path.join(GTFS_FOLDER, filename))
    .pipe(csv())
    .on("data", (data) => results.push(data))
    .on("end", () => callback(results));
}

async function importStops() {
  loadCSV("stops.txt", async (rows) => {
    await Stop.deleteMany({});
    await Stop.insertMany(
      rows.map((row) => ({
        stop_id: row.stop_id,
        stop_code: row.stop_code,
        stop_name: row.stop_name,
        stop_lat: parseFloat(row.stop_lat),
        stop_lon: parseFloat(row.stop_lon),
      }))
    );
    console.log("Stops imported");
  });
}

async function importRoutes() {
  loadCSV("routes.txt", async (rows) => {
    await Route.deleteMany({});
    await Route.insertMany(rows);
    console.log("Routes imported");
  });
}

async function importTrips() {
  loadCSV("trips.txt", async (rows) => {
    await Trip.deleteMany({});
    await Trip.insertMany(rows);
    console.log("Trips imported");
  });
}

async function importStopTimes() {
  loadCSV("stop_times.txt", async (rows) => {
    await StopTime.deleteMany({});
    await StopTime.insertMany(
      rows.map((row) => ({
        trip_id: row.trip_id,
        arrival_time: row.arrival_time,
        departure_time: row.departure_time,
        stop_id: row.stop_id,
        stop_sequence: parseInt(row.stop_sequence),
        pickup_type: parseInt(row.pickup_type),
        drop_off_type: parseInt(row.drop_off_type),
      }))
    );
    console.log("StopTimes imported");
  });
}

async function importCalendarDates() {
  loadCSV("calendar_dates.txt", async (rows) => {
    await CalendarDate.deleteMany({});
    await CalendarDate.insertMany(
      rows.map((row) => ({
        service_id: row.service_id,
        date: row.date,
        exception_type: parseInt(row.exception_type),
      }))
    );
    console.log("CalendarDates imported");
  });
}

async function importAll() {
  await mongoose.connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/mta",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );

  await importStops();
  await importRoutes();
  await importTrips();
  await importStopTimes();
  await importCalendarDates();

  mongoose.disconnect();
}

importAll();
