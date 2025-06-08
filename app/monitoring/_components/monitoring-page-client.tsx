"use client"

import { useState, useTransition } from "react"
import { IncidentOverlay } from "./incident-overlay"
import MonitoringClientPage from "./monitoring-client-page"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { simulateIncident, acknowledgeIncident } from "../_actions/incidents"
import { Camera } from "@/db/schema/cameras-schema"
import { toast } from "sonner"

interface MonitoringPageClientProps {
  cameras: Camera[]
}

export default function MonitoringPageClient({ cameras }: MonitoringPageClientProps) {
  const [overlayData, setOverlayData] = useState<null | { id: number; type: string; severity: number }>(null)
  const [isPending, startTransition] = useTransition()

  const handleSimulate = () => {
    startTransition(async () => {
      const result = await simulateIncident()
      if (result.success && result.type && typeof result.severity === 'number' && result.id) {
        setOverlayData({ id: result.id, type: String(result.type), severity: Number(result.severity) })
      } else {
        alert("Failed to simulate incident")
      }
    })
  }

  const handleAcknowledge = () => {
    if (!overlayData) return
    startTransition(async () => {
      await acknowledgeIncident(overlayData.id)
      setOverlayData(null)
      toast.success("Incident Acknowledged. See Incidents page for more details.")
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Monitoring</h1>
        <Button
          variant="outline"
          className="text-red-500 border border-red-500 rounded-full px-3 py-1.5 text-sm hover:bg-red-500/10 transition-colors"
          onClick={handleSimulate}
          disabled={isPending}
        >
          Simulate Incident
        </Button>
      </div>
      <p className="text-muted-foreground text-base mb-6 -mt-4">
        Live camera feeds and real-time monitoring of all security cameras.
      </p>
      <Card>
        <CardContent>
          <MonitoringClientPage cameras={cameras} />
        </CardContent>
      </Card>
      {overlayData && (
        <IncidentOverlay
          isOpen={true}
          onClose={handleAcknowledge}
          incidentType={overlayData.type}
          severity={overlayData.severity}
        />
      )}
    </div>
  )
} 