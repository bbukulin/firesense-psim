import { NextRequest, NextResponse } from 'next/server'
import { db } from '../../../../db'
import { incidents } from '../../../../db/schema/incidents-schema'
import { desc } from 'drizzle-orm'

export async function GET(_request: NextRequest) {
  try {
    const recentIncidents = await db
      .select()
      .from(incidents)
      .orderBy(desc(incidents.timestamp))
      .limit(5)

    return NextResponse.json(recentIncidents)
  } catch (error) {
    console.error('Error fetching recent incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
} 