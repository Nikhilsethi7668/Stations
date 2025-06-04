// app/trains/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, TrainFront, Clock, DollarSign, MapPin } from "lucide-react";

export default function TrainPage() {
  const { id } = useParams();
  const [train, setTrain] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch(`/api/trains/${id}`)
      .then((res) => res.json())
      .then((data) => setTrain(data));
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 cursor-pointer hover:underline"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back to Dashboard
        </div>

        <AnimatePresence>
          {train && (
            <motion.div
              key={train.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
              className="bg-white rounded-xl shadow-2xl p-8 border border-blue-100"
            >
              <h1 className="text-3xl font-bold text-blue-700 flex items-center gap-3">
                <TrainFront className="text-blue-500" /> {train.name}
              </h1>

              <p className="text-gray-600 mt-2 text-lg">
                <MapPin className="inline-block mr-1 text-green-500" />
                <strong className="text-blue-600">Route:</strong> {train.route.join(" → ")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-6">
                <div className="bg-gradient-to-r from-blue-100 to-blue-200 p-4 rounded-lg shadow">
                  <p className="text-blue-900 font-semibold flex items-center gap-2">
                    <Clock className="text-blue-700" /> Arrival Time
                  </p>
                  <p className="text-lg mt-1">{train.arrivalTime}</p>
                </div>

                <div className="bg-gradient-to-r from-green-100 to-green-200 p-4 rounded-lg shadow">
                  <p className="text-green-900 font-semibold flex items-center gap-2">
                    <Clock className="text-green-700" /> Departure Time
                  </p>
                  <p className="text-lg mt-1">{train.departureTime}</p>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-purple-200 p-4 rounded-lg shadow">
                  <p className="text-purple-900 font-semibold flex items-center gap-2">
                    <DollarSign className="text-purple-700" /> Fare
                  </p>
                  <p className="text-lg mt-1">${train.fare.toFixed(2)}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Passing Stations</h2>
                <ul className="list-disc pl-6 text-gray-800 space-y-1">
                  {train.route.map((station) => (
                    <li key={station}>{station}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
