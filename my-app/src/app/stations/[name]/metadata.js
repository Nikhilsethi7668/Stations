// app/stations/[name]/metadata.js
export async function generateMetadata({ params }) {
  const name = decodeURIComponent(params.name);
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/stations/${encodeURIComponent(name)}`);
  const station = await res.json();

  return {
    title: `${station.name} Station | MetroConnect`,
    description: `Explore gates and facilities at ${station.name}.`,
    openGraph: {
      title: station.name,
      description: `Entry gates: ${station.gates.join(", ")}`,
      url: `https://yourdomain.com/stations/${name}`,
    },
    twitter: {
      card: "summary",
      title: station.name,
    },
  };
}
