"use server"

import { db } from "@/db"
import { incidents, incidentTypes } from "@/db/schema/incidents-schema"
import { revalidatePath } from "next/cache"
import { eq } from "drizzle-orm"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function simulateIncident() {
  // Randomly select an incident type
  const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
  
  // Randomly select a severity level (1-3)
  const randomSeverity = Math.floor(Math.random() * 3) + 1

  try {
    const [insertedIncident] = await db.insert(incidents).values({
      type: randomType,
      description: "Simulated incident for demonstration purposes",
      severity: randomSeverity,
    }).returning()

    revalidatePath("/monitoring")
    return { 
      success: true,
      type: randomType,
      severity: randomSeverity,
      id: insertedIncident.id,
    }
  } catch {
    return { success: false, error: "Failed to simulate incident" }
  }
}

export async function acknowledgeIncident(incidentId: number) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" }
    }
    await db.update(incidents)
      .set({
        acknowledged: true,
        acknowledgedAt: new Date(),
        acknowledgedBy: session.user.id,
      })
      .where(eq(incidents.id, incidentId))
    revalidatePath("/monitoring")
    return { success: true }
  } catch {
    return { success: false, error: "Failed to acknowledge incident" }
  }
} 