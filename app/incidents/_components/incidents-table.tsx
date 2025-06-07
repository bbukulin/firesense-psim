"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

interface Incident {
  id: number
  timestamp: string
  type: string
  description: string
  severity: number
  acknowledged: boolean
  acknowledgedBy?: string | null
  acknowledgedAt?: string | null
  acknowledgedByEmail?: string | null
}

interface IncidentsTableProps {
  incidents: Incident[]
}

export default function IncidentsTable({ incidents }: IncidentsTableProps) {
  if (!incidents || incidents.length === 0) {
    return <div className="text-muted-foreground">No incidents found.</div>
  }

  return (
    <div>
      {/* Card list for small screens */}
      <div className="sm:hidden space-y-4">
        {incidents.map((incident) => (
          <div key={incident.id} className="rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-muted-foreground">{format(new Date(incident.timestamp), 'yyyy-MM-dd HH:mm:ss')}</span>
              <Badge className="ml-2">
                {incident.severity === 1 && "LOW"}
                {incident.severity === 2 && "MEDIUM"}
                {incident.severity === 3 && "HIGH"}
              </Badge>
            </div>
            <div className="font-semibold capitalize mb-1">{incident.type}</div>
            <div className="text-sm mb-2 truncate" title={incident.description}>{incident.description}</div>
            <div className="flex flex-col gap-1 text-xs">
              <div><span className="font-medium">Acknowledged:</span> {incident.acknowledged ? "Yes" : "No"}</div>
              <div><span className="font-medium">By:</span> {incident.acknowledgedByEmail || <span className="text-muted-foreground">-</span>}</div>
              <div><span className="font-medium">At:</span> {incident.acknowledgedAt ? format(new Date(incident.acknowledgedAt), 'yyyy-MM-dd HH:mm:ss') : <span className="text-muted-foreground">-</span>}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table for md+ screens */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border bg-card">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium text-sm py-2 px-3 text-right">Timestamp</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3">Type</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3">Description</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3">Severity</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3">Acknowledged</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3">Acknowledged By</TableHead>
              <TableHead className="font-medium text-sm py-2 px-3 text-right">Acknowledged At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {incidents.map((incident) => (
              <TableRow
                key={incident.id}
                className="odd:bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <TableCell className="text-sm py-2 px-3 text-right whitespace-nowrap">
                  {format(new Date(incident.timestamp), 'yyyy-MM-dd HH:mm:ss')}
                </TableCell>
                <TableCell className="text-sm py-2 px-3 capitalize">
                  {incident.type}
                </TableCell>
                <TableCell
                  className="text-sm py-2 px-3 max-w-xs truncate"
                  title={incident.description}
                >
                  {incident.description}
                </TableCell>
                <TableCell className="text-sm py-2 px-3">
                  {incident.severity === 1 && (
                    <Badge variant="outline">LOW</Badge>
                  )}
                  {incident.severity === 2 && (
                    <Badge variant="default">MEDIUM</Badge>
                  )}
                  {incident.severity === 3 && (
                    <Badge variant="destructive">HIGH</Badge>
                  )}
                </TableCell>
                <TableCell className="text-sm py-2 px-3">
                  {incident.acknowledged ? "Yes" : "No"}
                </TableCell>
                <TableCell className="text-sm py-2 px-3">
                  {incident.acknowledgedByEmail ? incident.acknowledgedByEmail : <span className="text-muted-foreground">-</span>}
                </TableCell>
                <TableCell className="text-sm py-2 px-3 text-right whitespace-nowrap">
                  {incident.acknowledgedAt ? format(new Date(incident.acknowledgedAt), 'yyyy-MM-dd HH:mm:ss') : <span className="text-muted-foreground">-</span>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
} 