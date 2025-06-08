"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Incident } from "@/db/schema/incidents-schema"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

// Extend the Incident type to include the email from the join
type IncidentWithEmail = Incident & {
  acknowledgedByEmail: string | null
}

interface IncidentDetailsDialogProps {
  incident: IncidentWithEmail | undefined
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function IncidentDetailsDialog({
  incident,
  open,
  onOpenChange,
}: IncidentDetailsDialogProps) {
  const router = useRouter()

  const handleAcknowledge = async () => {
    if (!incident) return

    try {
      const response = await fetch(`/api/incidents/${incident.id}/acknowledge`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to acknowledge incident')
      }

      toast.success('Incident acknowledged successfully')
      router.refresh()
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to acknowledge incident')
      console.error('Error acknowledging incident:', error)
    }
  }

  if (!incident) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="capitalize">{incident.type}</span>
            {incident.severity === 1 && <Badge variant="outline">LOW</Badge>}
            {incident.severity === 2 && <Badge variant="default">MEDIUM</Badge>}
            {incident.severity === 3 && <Badge variant="destructive">HIGH</Badge>}
          </DialogTitle>
          <DialogDescription>
            Incident detected at {format(new Date(incident.timestamp), 'yyyy-MM-dd HH:mm:ss')}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium">Description</h4>
            <p className="text-sm text-muted-foreground">{incident.description}</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Status</h4>
            <div className="text-sm text-muted-foreground">
              <p>Acknowledged: {incident.acknowledged ? "Yes" : "No"}</p>
              {incident.acknowledgedByEmail && (
                <p>Acknowledged by: {incident.acknowledgedByEmail}</p>
              )}
              {incident.acknowledgedAt && (
                <p>Acknowledged at: {format(new Date(incident.acknowledgedAt), 'yyyy-MM-dd HH:mm:ss')}</p>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          {!incident.acknowledged && (
            <Button onClick={handleAcknowledge} className="cursor-pointer">
              Acknowledge Incident
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 