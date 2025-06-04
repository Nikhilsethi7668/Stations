// components/MetroDashboard.js
"use client";

import { useState } from "react";
import { Card, CardContent } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { MapPin, Clock, TrainFront } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SideDrawer from "./SideDrawer";

const stations = [
  { name: "Central Station", gates: ["Gate A1", "Gate A2"] },
  { name: "Tech Park", gates: ["Gate B1", "Gate B2"] },
  { name: "Old Town", gates: ["Gate C1", "Gate C2"] },
];

const trains = [
  { id: "T101", name: "Blue Line Express", route: "Central Station - Old Town" },
  { id: "T202", name: "Green Commuter", route: "Tech Park - Central Station" },
];

const dummyData = {
  fare: "$2.50",
  arrivalTime: "10:15 AM",
  reachTime: "10:35 AM",
};

export default function MetroDashboard() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [showStations, setShowStations] = useState(false);
  const [showTrains, setShowTrains] = useState(false);
  const [stationQuery, setStationQuery] = useState("");
  const [trainQuery, setTrainQuery] = useState("");

  const selectedSource = stations.find((s) => s.name === source);
  const selectedDestination = stations.find((s) => s.name === destination);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-gradient-to-b flex-wrap lg:w-[70vw] from-blue-800  to-blue-500 text-white px-6 py-4 flex justify-around mx-auto items-center shadow-md rounded-2xl">
        <div className="text-2xl font-bold">MetroConnect</div>
        <div className="flex items-center gap-6">
          <button onClick={() => setShowStations(true)} className="hover:underline">All Stations</button>
          <button onClick={() => setShowTrains(true)} className="hover:underline">All Trains</button>
        </div>
      </nav>

      {/* Side Drawer: All Stations */}
      <SideDrawer title="All Stations" isOpen={showStations} onClose={() => setShowStations(false)}>
        <input
          type="text"
          placeholder="Search stations..."
          className="mb-3 w-full border rounded px-3 py-2"
          value={stationQuery}
          onChange={(e) => setStationQuery(e.target.value)}
        />
        <ul className="space-y-2">
          {stations
            .filter((s) => s.name.toLowerCase().includes(stationQuery.toLowerCase()))
            .map((station) => (
              <li key={station.name} className="text-blue-700 hover:underline">
                <Link href={`/stations?name=${encodeURIComponent(station.name)}`}>{station.name}</Link>
              </li>
            ))}
        </ul>
      </SideDrawer>

      {/* Side Drawer: All Trains */}
      <SideDrawer title="All Trains" isOpen={showTrains} onClose={() => setShowTrains(false)}>
        <input
          type="text"
          placeholder="Search trains..."
          className="mb-3 w-full border rounded px-3 py-2"
          value={trainQuery}
          onChange={(e) => setTrainQuery(e.target.value)}
        />
        <ul className="space-y-2">
          {trains
            .filter((t) => t.name.toLowerCase().includes(trainQuery.toLowerCase()))
            .map((train) => (
              <li key={train.id} className="text-green-700 hover:underline">
                <Link href={`/trains?id=${train.id}`}>{train.name}</Link>
              </li>
            ))}
        </ul>
      </SideDrawer>

      {/* Main Dashboard */}
      <div className="max-w-4xl mx-auto p-6 grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="Select Source Station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.name} value={station.name}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setDestination}>
            <SelectTrigger>
              <SelectValue placeholder="Select Destination Station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.name} value={station.name}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {source && destination && source !== destination && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 mt-4"
          >
            <Card className="shadow-xl">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <TrainFront className="text-blue-600" />
                  <p className="text-lg font-medium">
                    Fare: <span className="text-gray-700">{dummyData.fare}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-green-600" />
                  <p className="text-lg font-medium">
                    Train Arrival: <span className="text-gray-700">{dummyData.arrivalTime}</span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-600" />
                  <p className="text-lg font-medium">
                    Reach Time: <span className="text-gray-700">{dummyData.reachTime}</span>
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 border rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                      <MapPin /> Entry Gates at {source}
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedSource?.gates.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                      <MapPin /> Entry Gates at {destination}
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {selectedDestination?.gates.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
