"use server"

import IncidentsTable from "./_components/incidents-table"
import { Suspense } from "react"
import { getAllIncidents } from "@/lib/incidents"

export default async function IncidentsPage() {
  const incidents = await getAllIncidents();

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 w-full max-w-5xl md:max-w-full">Incidents</h1>
      <p className="text-muted-foreground text-base mb-6 -mt-4 w-full max-w-5xl md:max-w-full">View and manage all security incidents, their status, and resolution details.</p>
      <div className="w-full max-w-5xl md:max-w-full">
        <div className="p-4 sm:p-6 bg-card rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Incident Log</h2>
          <Suspense fallback={<IncidentsTable incidents={[]} isLoading={true} />}>
            <IncidentsTable incidents={incidents} />
          </Suspense>
        </div>
      </div>
    </div>
  )
} 