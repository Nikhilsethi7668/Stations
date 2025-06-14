// components/MetroDashboard.js
"use client";

import { useState,useEffect } from "react";
import { Card, CardContent } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { MapPin, Clock, TrainFront , CircleDollarSign, Route} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import SideDrawer from "./SideDrawer";
import { useRouter } from "next/navigation"; // you're already doing this
import { get } from "http";


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


export default function MetroDashboard({ prefilledSource , prefilledDestination,prefilledDateTrip }) {
 const [source, setSource] = useState(prefilledSource);
  const [destination, setDestination] = useState(prefilledDestination);
  const [showStations, setShowStations] = useState(false);
  const [showTrains, setShowTrains] = useState(false);
  const [stationQuery, setStationQuery] = useState("");
  const [trainQuery, setTrainQuery] = useState("");
  const [trainList, setTrainList] = useState(null);
  const [stations, setStations] = useState([]);
  const [dateTrip, setDateTrip] = useState(prefilledDateTrip); // Default to today in YYYYMMDD format
  const router = useRouter();

  // const selectedSource = stations.find((s) => s.name === source);
  // const selectedDestination = stations.find((s) => s.name === destination);
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    console.log("Backend URL:", backendUrl);
  useEffect( () => {
   const fetchStations = async () => {
    await fetch(`${backendUrl}/api/station`)
      .then((res) => res.json())
      .then((data) => setStations(data));
  };
  fetchStations();
  }, []);


useEffect(() => {

  if(!source || !destination || !dateTrip || source === destination) {
    console.log("Invalid input: source, destination, or dateTrip is missing or source equals destination.");
    return;
  }
  const getTripDetails = async () => {

    console.log("Fetching trip details for:", source, "to", destination, "on", dateTrip);
    
  if (source && destination && source !== destination && dateTrip) {
    console.log("dateTrip:", dateTrip);
    console.log("Fetching trains for:", source, "to", destination);

    const dateString = dateTrip.replaceAll('-', '')
    // POST request to fetch trains based on source, destination, and date
    const requestBody = {
      from_stop_id: source.split('-')[0], // Assuming source is in format "id-name"
      to_stop_id: destination.split('-')[0], // Assuming destination is in format "id-name"
      date: dateString,
    };
    console.log("Request body:", requestBody);
    const tripRes=await fetch(`${backendUrl}/api/trip`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    console.log("Response status:", tripRes.status);
    if(tripRes.status !== 200) {
      console.error("Failed to fetch trips:", tripRes.statusText);
      setTrainList([]);
      return;
    }
     
          

    const data = await tripRes.json();
    console.log("Fetched trips:", data);
    setTrainList(data);
    
  }
  }
  getTripDetails();
  console.log("routerPathname: ",router.pathname);
   if(router.pathname !== `/routes/${encodeURIComponent(source)}-to-${encodeURIComponent(destination)}-for-${encodeURIComponent(dateTrip)}`) {
          router.push(`/routes/${encodeURIComponent(source)}-to-${encodeURIComponent(destination)}-for-${encodeURIComponent(dateTrip)}`, { scroll: false });
        
       }

    // fetch(`/api/trip?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}&date=${encodeURIComponent(dateTrip)}`)
     
    
    // fetch(`/api/metro?source=${encodeURIComponent(source)}&destination=${encodeURIComponent(destination)}`)
    //   .then(res => res.json())
    //   .then(data => {
    //     if (!data.error) {
    //       setTrainList(data.trains);
         
       
    //     } else {
    //       console.error(data.error);
    //       setTrainList([]);
    //     }
    //   });

  
}, [source, destination,dateTrip,router]);

  return (
    <div className="min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold mb-6 text-center text-blue-700">Metro Journey Planner</h1>
    
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
              <Link href={`/stations/${encodeURIComponent(station.name)}`}>{station.name}</Link>
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
              <Link href={`/trains/${train.id}`}>{train.name}</Link>
            </li>
          ))}
      </ul>
      </SideDrawer>

      {/* Main Dashboard */}
      <div className="max-w-4xl mx-auto p-6 grid gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select onValueChange={setSource} valueChange={source?.split('-')[1]}>
            <SelectTrigger>
              <SelectValue placeholder="Select Source Station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.name} value={`${station.id}-${station.name}`}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setDestination} valueChange={destination?.split('-')[1]}>
            <SelectTrigger>
              <SelectValue placeholder="Select Destination Station" />
            </SelectTrigger>
            <SelectContent>
              {stations.map((station) => (
                <SelectItem key={station.name} value={`${station.id}-${station.name}`}>
                  {station.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

        <input
          type="date"
          className="border rounded-lg px-3 py-2 w-full"
          value={dateTrip} // display as YYYY-MM-DD
          onChange={(e) => {
            setDateTrip((e.target.value)); // store as YYYYMMDD
          }}
        />


          
        </div>
       {source && destination && source === destination && (
          <div>
            <h2 className="text-2xl font-semibold mt-4">Same Source and Destination</h2>
          </div>
       )}
       {source && destination && source !== destination &&  !trainList &&(
         <div>
            <h2 className="text-2xl font-semibold mt-4">Loading ...</h2>
         </div>
       )}
       {source && destination && source !== destination &&  trainList?.length === 0 &&(
         <div>
            <h2 className="text-2xl font-semibold mt-4">No Trains Available</h2>
         </div>
       )}
       {source && destination && source !== destination && trainList?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid gap-6 mt-4"
            >
            {trainList?.map(train => (
              <Card key={train.trip_id} className="shadow-xl">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <TrainFront className="text-blue-600" />
                    <p className="text-lg font-medium">
                      Route Name: <span className="text-gray-700">{train.route_name}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-green-600" />
                    <p className="text-lg font-medium">
                      Departure: <span className="text-gray-700">{train.departure_time}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="text-purple-600" />
                    <p className="text-lg font-medium">
                      Arrival: <span className="text-gray-700">{train.arrival_time}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                   <CircleDollarSign  className="text-red-600" />
                    <p className="text-lg font-medium"> 
                      Fare: <span className="text-gray-700">{train?.fare}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ">
                      <Route className="text-purple-500"/>
                  <span className="text-md font-semibold">
                      Route: {train.stops
                        .map((station) => {
                          const matched = stations?.find((s) => s.id === station.stop_id);
                          return matched?.name || station.stop_id;
                        })
                        .join(' → ')}
                    </span> 
                  </div>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-3 border rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                      <MapPin /> Entry Gates at {source}
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {train?.entryGatesSource?.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3 border rounded-xl bg-gray-50">
                    <h4 className="font-semibold text-blue-700 flex items-center gap-2">
                      <MapPin /> Entry Gates at {destination}
                    </h4>
                    <ul className="list-disc list-inside text-gray-700">
                      {train?.entryGatesDestination?.map((gate) => (
                        <li key={gate}>{gate}</li>
                      ))}
                    </ul>
                  </div>
                </div>
          
                </CardContent>
              </Card>
            ))}
          </motion.div>
        )}

      </div>
    </div>
  );
}
