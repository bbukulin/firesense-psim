import { NextResponse } from 'next/server'
import { db } from '@/db'
import { incidents } from '@/db/schema/incidents-schema'
import { users } from '@/db/schema/users-schema'
import { desc, eq } from 'drizzle-orm'

export async function GET() {
  try {
    const allIncidents = await db
      .select({
        id: incidents.id,
        timestamp: incidents.timestamp,
        type: incidents.type,
        description: incidents.description,
        severity: incidents.severity,
        acknowledged: incidents.acknowledged,
        acknowledgedBy: incidents.acknowledgedBy,
        acknowledgedAt: incidents.acknowledgedAt,
        acknowledgedByEmail: users.email,
      })
      .from(incidents)
      .leftJoin(users, eq(incidents.acknowledgedBy, users.id))
      .orderBy(desc(incidents.timestamp))
    return NextResponse.json(allIncidents)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch incidents' }, { status: 500 })
  }
} 