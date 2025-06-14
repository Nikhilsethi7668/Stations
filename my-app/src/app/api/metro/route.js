import { NextResponse } from 'next/server';
import metroData from '../../../../public/metroData.json';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const source = searchParams.get("source");
  const destination = searchParams.get("destination");

  if (!source || !destination || source === destination) {
    return NextResponse.json({ error: "Invalid source or destination" }, { status: 400 });
  }

  // Filter trains that include both source and destination in their route
  const matchingTrains = metroData.trains.filter(train =>
    train.route.includes(source) && train.route.includes(destination)
  );

  if (matchingTrains.length === 0) {
    return NextResponse.json({ error: "No trains available between selected stations" }, { status: 404 });
  }

  // Map the matching trains to include necessary details
  const trainsWithDetails = matchingTrains.map(train => {
    const sourceIndex = train.route.indexOf(source);
    const destinationIndex = train.route.indexOf(destination);

    // Ensure the train travels from source to destination in order
    if (sourceIndex < destinationIndex) {
      return {
        id: train.id,
        name: train.name,
        fare: `$${train.fare.toFixed(2)}`,
        arrivalTime: train.arrivalTime,
        departureTime: train.departureTime,
        route: train.route?.slice(sourceIndex, destinationIndex + 1),
        entryGatesSource: metroData.stations.find(station => station.name === source)?.gates || [],
        entryGatesDestination: metroData.stations.find(station => station.name === destination)?.gates || []
      };
    }
    return null;
  }).filter(train => train !== null);

  return NextResponse.json({ trains: trainsWithDetails });
}
