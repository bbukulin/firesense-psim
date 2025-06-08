"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { Incident } from "@/db/schema/incidents-schema"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

async function getRecentIncidents() {
  const response = await fetch('/api/incidents/recent')
  if (!response.ok) {
    throw new Error('Failed to fetch incidents')
  }
  return response.json()
}

export default function IncidentLogsTable() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await getRecentIncidents()
        setIncidents(data)
      } catch (err) {
        setError('Failed to load incidents')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchIncidents()
  }, [])

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Timestamp</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Severity</TableHead>
          <TableHead>Acknowledged</TableHead>
          <TableHead>Resolved</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><Skeleton className="h-4 w-32" /></TableCell>
              <TableCell><Skeleton className="h-4 w-24" /></TableCell>
              <TableCell><Skeleton className="h-4 w-48" /></TableCell>
              <TableCell><Skeleton className="h-4 w-16" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
              <TableCell><Skeleton className="h-4 w-12" /></TableCell>
            </TableRow>
          ))
        ) : (
          incidents.map((incident) => (
            <TableRow key={incident.id}>
              <TableCell>
                {format(new Date(incident.timestamp), 'yyyy-MM-dd HH:mm:ss')}
              </TableCell>
              <TableCell className="capitalize">{incident.type}</TableCell>
              <TableCell>{incident.description}</TableCell>
              <TableCell>
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
              <TableCell>{incident.acknowledged ? "Yes" : "No"}</TableCell>
              <TableCell>{incident.resolved ? "Yes" : "No"}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
} 