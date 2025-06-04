import { NextResponse } from 'next/server';
import metroData from '../../../../../public/metroData.json';

export async function GET(request, { params }) {
  const { name } = await params;
  console.log(name);
  
  const station = metroData.stations.find(
    (s) => s.name.toLowerCase() === decodeURIComponent(name).toLowerCase()
  );

  if (!station) {
    return NextResponse.json({ error: 'Station not found' }, { status: 404 });
  }

  return NextResponse.json(station);
}
