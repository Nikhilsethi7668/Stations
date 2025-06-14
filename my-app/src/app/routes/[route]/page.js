// app/[route]/page.js
import { notFound } from "next/navigation";
import MetroDashboard from "../../components/MetroDashboard"; // Reuse your existing component
import FadePage from "@/app/components/FadePage";

export async function generateMetadata({ params }) {
  const {route} =await params;
  const [source, destination] = decodeURIComponent(route).split("-to-");

  if (!source || !destination) {
    return { title: "Metro Planner | MetroConnect" };
  }

  return {
    title: `${source} to ${destination} | Metro Planner`,
    description: `Find trains, gates, and fare info from ${source} to ${destination}.`,
    openGraph: {
      title: `${source} to ${destination} | MetroConnect`,
      description: `Get schedule and gate info between ${source} and ${destination}`,
    },
    twitter: {
      card: "summary",
      title: `Metro from ${source} to ${destination}`,
    },
  };
}

export default async function RoutePage({ params }) {
   const {route} =await params;
 const [fromTo, dateTrip] = decodeURIComponent(route).split("-for-");
 const [source, destination] = fromTo.split("-to-");

  console.log(source, destination, dateTrip);
  

  if (!source || !destination || source === destination || !dateTrip) {
    notFound(); // optional: handle bad URL
  }

  return (
  <main className="min-h-screen bg-gray-100 p-4">
    <MetroDashboard
      prefilledSource={source}
      prefilledDestination={destination}
      prefilledDateTrip={dateTrip}
    />
    </main>
   
  );
}
