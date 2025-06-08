import { NextResponse } from 'next/server'
import { getAllIncidents } from '@/lib/incidents'

export async function GET() {
  try {
    const allIncidents = await getAllIncidents();
    return NextResponse.json(allIncidents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
} 