"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const INCIDENTS = [
  {
    id: 1,
    timestamp: "2024-06-01 10:15:00",
    type: "fire",
    description: "Fire detected in Server Room",
    severity: "HIGH",
    acknowledged: true,
    resolved: false,
  },
  {
    id: 2,
    timestamp: "2024-06-01 09:50:00",
    type: "smoke",
    description: "Smoke detected in Main Floor",
    severity: "MEDIUM",
    acknowledged: false,
    resolved: false,
  },
  {
    id: 3,
    timestamp: "2024-06-01 09:30:00",
    type: "temperature",
    description: "High temperature in Warehouse",
    severity: "LOW",
    acknowledged: true,
    resolved: true,
  },
  {
    id: 4,
    timestamp: "2024-06-01 09:10:00",
    type: "gas",
    description: "Gas leak detected in Lab",
    severity: "HIGH",
    acknowledged: false,
    resolved: false,
  },
  {
    id: 5,
    timestamp: "2024-06-01 08:55:00",
    type: "fire",
    description: "Fire detected in Office",
    severity: "MEDIUM",
    acknowledged: true,
    resolved: true,
  },
]

export default function IncidentLogsTable() {
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
        {INCIDENTS.map((incident) => (
          <TableRow key={incident.id}>
            <TableCell>{incident.timestamp}</TableCell>
            <TableCell className="capitalize">{incident.type}</TableCell>
            <TableCell>{incident.description}</TableCell>
            <TableCell>{incident.severity}</TableCell>
            <TableCell>{incident.acknowledged ? "Yes" : "No"}</TableCell>
            <TableCell>{incident.resolved ? "Yes" : "No"}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 