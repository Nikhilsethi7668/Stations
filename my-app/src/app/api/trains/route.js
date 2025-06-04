import { NextResponse } from 'next/server';
import metroData from '../../../../public/metroData.json';

export async function GET() {
  return NextResponse.json({ trains: metroData.trains });
}
