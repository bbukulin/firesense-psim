import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { incidents } from '@/db/schema/incidents-schema'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config'
import { eq } from 'drizzle-orm'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json({ error: 'Missing incident ID' }, { status: 400 })
    }

    const incidentId = parseInt(id)
    if (isNaN(incidentId)) {
      return NextResponse.json({ error: 'Invalid incident ID' }, { status: 400 })
    }

    // Update the incident
    await db
      .update(incidents)
      .set({
        acknowledged: true,
        acknowledgedBy: session.user.id,
        acknowledgedAt: new Date(),
      })
      .where(eq(incidents.id, incidentId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error acknowledging incident:', error)
    return NextResponse.json(
      { error: 'Failed to acknowledge incident' },
      { status: 500 }
    )
  }
} 