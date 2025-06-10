const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const mongoose = require("mongoose");

require("dotenv").config(); 

const Stop = require("../Models/Stop");
const Route = require("../Models/Route");
const Trip = require("../Models/Trip");
const StopTime = require("../Models/StopTime");
const CalendarDate = require("../Models/CalendarDate");

const GTFS_FOLDER = path.join(__dirname, "..", "gtfslirr");


function loadCSV(filename) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(GTFS_FOLDER, filename))
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", (err) => reject(err));
  });
}

async function importStops() {
  const rows = await loadCSV("stops.txt");
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
}

async function importRoutes() {
  const rows = await loadCSV("routes.txt");
  await Route.deleteMany({});
  await Route.insertMany(rows);
  console.log(" Routes imported");
}

async function importTrips() {
  const rows = await loadCSV("trips.txt");
  await Trip.deleteMany({});
  await Trip.insertMany(rows);
  console.log("Trips imported");
}

async function importStopTimes() {
  const rows = await loadCSV("stop_times.txt");
  await StopTime.deleteMany({});
  await StopTime.insertMany(
    rows.map((row) => ({
      trip_id: row.trip_id,
      arrival_time: row.arrival_time,
      departure_time: row.departure_time,
      stop_id: row.stop_id,
      stop_sequence: parseInt(row.stop_sequence),
      pickup_type: parseInt(row.pickup_type) || 0,
      drop_off_type: parseInt(row.drop_off_type) || 0,
    }))
  );
  console.log("✅ StopTimes imported");
}

async function importCalendarDates() {
  const rows = await loadCSV("calendar_dates.txt");
  await CalendarDate.deleteMany({});
  await CalendarDate.insertMany(
    rows.map((row) => ({
      service_id: row.service_id,
      date: row.date,
      exception_type: parseInt(row.exception_type),
    }))
  );
  console.log("✅ CalendarDates imported");
}

async function importAll() {
  await mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB Connected");

  try {
    await importStops();
    await importRoutes();
    await importTrips();
    await importStopTimes();
    await importCalendarDates();
  } catch (err) {
    console.error("❌ Error during import:", err);
  }

  await mongoose.disconnect();
  console.log("✅ MongoDB Disconnected");
}

importAll();
