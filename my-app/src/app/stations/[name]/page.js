"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter  } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin } from "lucide-react";
import Head from "next/head";

const backendUrl = process.env.BACKEND_URL;
export default function StationPage() {
  const { name } = useParams();
  const [station, setStation] = useState(null);
   const router = useRouter();

  useEffect(() => {
    fetch(`/api/stations/${encodeURIComponent(name)}`)
      .then((res) => res.json())
      .then((data) => setStation(data));
  }, [name]);

  if (!station) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-200 to-blue-300 text-blue-900 font-semibold text-xl animate-pulse">
        Loading station info...
      </div>
    );
  }

  return (

    <div className="min-h-screen bg-gradient-to-bl from-slate-50 via-blue-50 to-indigo-100 p-8">
      {station && (
        <Head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "TrainStation",
                "name": station?.name,
                "amenityFeature": station?.gates?.map((gate) => ({
                  "@type": "LocationFeatureSpecification",
                  "name": gate
                }))
              })
            }}
          />
        </Head>
      )}


      
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-3xl mx-auto"
      >
       <div
          className="flex items-center gap-2 text-blue-600 font-medium mb-6 cursor-pointer hover:underline"
          onClick={() => router.back()}
        >
          <ArrowLeft /> Back to Dashboard
        </div>
        {/* Station Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-teal-500 text-white px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4">
          <MapPin className="w-6 h-6" />
          <h1 className="text-2xl sm:text-3xl font-bold tracking-wide">
            {station.name}
          </h1>
        </div>

        {/* Gates */}
        <motion.div
          className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.15,
              },
            },
          }}
        >
          {station?.gates?.map((gate, idx) => (
            <motion.div
              key={gate}
              className="bg-white rounded-xl shadow-md border border-blue-100 p-5 hover:scale-[1.03] transition-transform duration-200"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <p className="text-lg font-semibold text-blue-700">
                🛂 {gate}
              </p>
              <p className="text-sm text-gray-500 mt-1">Entry available 24/7</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
