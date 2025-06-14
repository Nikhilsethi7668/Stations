// app/trains/[id]/metadata.js

export async function generateMetadata({ params }) {
  const {id} = await params;

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/trains/${id}`);
  const train = await res.json();

  return {
    title: `${train.name} | MetroConnect`,
    description: `Details and route info for ${train.name} train.`,
    openGraph: {
      title: train.name,
      description: `Covers route: ${train.route.join(" → ")}`,
      url: `https://yourdomain.com/trains/${id}`,
    },
    twitter: {
      card: "summary_large_image",
      title: train.name,
    },
  };
}
