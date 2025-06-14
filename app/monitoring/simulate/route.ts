import { simulateIncident } from "../_actions/incidents"
import { redirect } from "next/navigation"

export async function GET() {
  const result = await simulateIncident()
  
  if (!result.success) {
    // If simulation fails, redirect to monitoring page with error
    redirect("/monitoring?error=simulation_failed")
  }
  
  // Redirect to monitoring page with incident details for overlay
  redirect(`/monitoring?type=${result.type}&severity=${result.severity}`)
} 