"use server"

import IncidentsTable from "./_components/incidents-table"

export default async function IncidentsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  const res = await fetch(`${baseUrl}/api/incidents`, { cache: 'no-store' })
  const incidents = await res.json()

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 w-full max-w-5xl md:max-w-full">Incidents</h1>
      <div className="w-full max-w-5xl md:max-w-full">
        <div className="p-4 sm:p-6 bg-card rounded-lg border">
          <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Incident Log</h2>
          <IncidentsTable incidents={incidents} />
        </div>
      </div>
    </div>
  )
} 