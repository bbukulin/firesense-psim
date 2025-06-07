"use server"

export default async function IncidentsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Incidents</h1>
      <div className="grid gap-6">
        <div className="p-6 bg-card rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Incident Log</h2>
          <p className="text-muted-foreground">
            This page will show a history of all security incidents, including fire alerts, sensor triggers, and other events.
          </p>
        </div>
      </div>
    </div>
  )
} 