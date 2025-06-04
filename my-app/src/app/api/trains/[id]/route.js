import { NextResponse } from 'next/server';
import metroData from '../../../../../public/metroData.json';

export async function GET(request, { params }) {
  const { id } =await params;
  const train = metroData.trains.find((t) => t.id === id);

  if (!train) {
    return NextResponse.json({ error: 'Train not found' }, { status: 404 });
  }

  return NextResponse.json(train);
}
