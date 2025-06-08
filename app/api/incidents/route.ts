import { NextResponse } from 'next/server'
import { db } from '@/db'
import { incidents } from '@/db/schema/incidents-schema'
import { users } from '@/db/schema/users-schema'
import { desc, eq } from 'drizzle-orm'
import { getAllIncidents } from '@/lib/incidents'

export async function GET() {
  try {
    const allIncidents = await getAllIncidents();
    return NextResponse.json(allIncidents)
  } catch {
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
} 